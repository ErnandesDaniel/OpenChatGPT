<template>
  <div class="page">

    <img src='@/assets/logo.svg' class='logo'/>

    <p class='title'>chatGTP</p>

    <div class='confirmationСodeBlock'>

      <input type='text' placeholder='Код подтверждения' v-model='confirmationCode'/>

      <button v-on:click='requestToCheckConfirmationCode'>Ввод</button>

    </div>

   <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>



  </div>

</template>

<script>

import { useAutorizationStore } from '@/stores/autorization.js'
import { useSocketConnectionStore } from '@/stores/socketConnection.js'

export default {

    setup() {


      const autorization=useAutorizationStore();
      const socketConnection=useSocketConnectionStore();
      return {autorization, socketConnection}

    },

    data(){

      return{

        confirmationCode:'',

        errorMessage:'',

      }
    },

    watch:{

       confirmationCode(){

        this.errorMessage='';

      },

    },

    methods:{

      async requestToCheckConfirmationCode(){

        //При нажатии на кнопку ошибка обнуляется
         this.errorMessage='';

        if(this.confirmationCode.length<1){

          this.errorMessage='Введите код подтверждения';

        }else{

          try{

            //Пытаемся отправить запрос на сервер
            let response=await this.axios.post('sendRegistrationConfirmationCode',{

              email:this.autorization.email,
              password:this.autorization.password,
              confirmationCode: this.confirmationCode,

            });

              console.log(response);

            if(response.data.errorExist==true){

              if(response.data.actionMessage=='invalidConfirmationCode'){

                this.errorMessage='Неверный код подтверждения'

              }

            }else if(response.data.actionMessage=='emailHasBeenConfirmed'){

              //Если ошибки нет, то отправляем запрос на получение токена авторизации:

              //Отправляем запрос на сервер для полученя токена авторизации
              response=await this.axios.post('getAuthenticationToken',{
                email:this.autorization.email,
                password:this.autorization.password,
                confirmationCode:this.confirmationCode,

              });

              console.log(response);

              //Получаем токен авторизации
              let authorizationToken=response.data.content.token;

              //Записываем новый токен авторизации в локальной памяти
              //и в оперативной памяти
              this.autorization.setAuthorizationToken(authorizationToken);

              //Ставим активный блок на странице входа на авторизацию
              this.autorization.setAuthorizationSelectedBlock("authorization");

              //Устанавливаем статус авторизации на true
              this.autorization.setStatusOfAuthorization(true);

              //Пытаемся в цикле каждую секунду подключиться к серверу по webSocket
              this.socketConnection.connectToSocketServer();

              //Переходим на страницу списка чатов
              this.$router.push('/');

            }

          } catch(error){

            console.log(error);

            //В случае ошибки подключения пишем, что сервер не допступен
            if(error.code=='ERR_NETWORK'){

              this.registerErrorMessage='Нет доступа к серверу';

            }

          }

        }

      },

    },

  }

</script>

<style scoped>



 .page{

    height:100%;
    width:100%;

    padding-top:max(10%, 60px);

  }

  .logo{
    
    width:auto;
    display:block;
    margin-left:auto;
    margin-right:auto;

  }

  .title{

    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    display: flex;
    align-items: center;
    justify-content:center;
    color: #2989A3;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width:100%;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:50px;

  }


.confirmationСodeBlock{

    display:flex;
    flex-direction:column;
    align-items:center;
    position:relative;
    width:auto;
    height:auto;


  }

 input{

    width: 250px;
    height: 50px;
    background: #D9D9D9;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 25px;
    margin-bottom:30px;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;
    text-align: center;
    text-align:center;
    font-family: Arial;

  }

  button{

    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 25px;
    width: 250px;
    height: 50px;
    background: #D9D9D9;
    border-radius: 25px;
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    display: flex;
    align-items: center;
    justify-content:center;
    text-align: center;
    text-transform: capitalize;
    text-align:center;
    font-family: Arial;

  }

  .errorBlock{

    width:230px;
    color:red;
    font-size:20px;
    margin-left:auto;
    margin-right:auto;
    display:flex;
    justify-content:center;
    margin-top:20px;
    text-align:center;

}



</style>
