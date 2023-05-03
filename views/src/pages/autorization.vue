<template>

  <div class='page'>

    <img src='@/assets/logo.svg' class='logo'/>

      <p class='title'>ChatGTP Open</p>

    <div class='selectAction'>

      <p 

      v-on:click='changeAuthorizationSelectedBlock("authorization")'

      v-bind:class='{ selectedAction: autorization.authorizationSelectedBlock=="authorization"}'

      >Вход</p>

      <p 

        v-on:click='changeAuthorizationSelectedBlock("registration")'

        v-bind:class='{ selectedAction: autorization.authorizationSelectedBlock=="registration"}'

      >Регистрация</p>

    </div>


    <div class='registrationBlock' v-if='autorization.authorizationSelectedBlock=="registration"'>

      <input type='text' placeholder='Email' v-model='registerEmail'/>

      <input type='password'  placeholder='Пароль' v-model='registerPassword'

        autocomplete="new-password"

      />

      <button v-on:click='requestToRegistration'>Зарегистрироваться</button>

      <div class='errorBlock' v-if='registerErrorMessage!=""'>{{registerErrorMessage}}</div>

    </div>

    <div class='authorizationBlock' v-if='autorization.authorizationSelectedBlock=="authorization"'>

      <input type='text' placeholder='Email' v-model='enterEmail'/>

      <input type='password' placeholder='Пароль' v-model='enterPassword'/>

      <button v-on:click='requestToAuthorization'>Войти</button>

      <div class='errorBlock' v-if='enterErrorMessage!=""'>{{enterErrorMessage}}</div>

    </div>

  </div>
  
</template>

<script>

  import { useAutorizationStore } from '@/stores/autorization.js'
  import { useSocketConnectionStore } from '@/stores/socketConnection.js'

  export default {

    setup() {

      const socketConnection=useSocketConnectionStore();
      const autorization=useAutorizationStore();
      return {autorization, socketConnection}

    },


    data(){

      return{

        enterEmail:'',

        enterPassword:'',

        registerEmail:'',

        registerPassword:'',

        registerErrorMessage:'',

        enterErrorMessage:'',

      }
    },


    watch:{

      enterEmail(){

        this.enterErrorMessage='';

      },

      enterPassword(){

        this.enterErrorMessage='';

      },

      registerEmail(){

        this.registerErrorMessage='';

      },

      registerPassword(){

        this.registerErrorMessage='';

      },


    },


    methods:{

      changeAuthorizationSelectedBlock(authorizationSelectedBlock){

        this.autorization.setAuthorizationSelectedBlock(authorizationSelectedBlock);

      },

      async requestToRegistration(){


        if(this.registerEmail.length<1){

          this.registerErrorMessage='Введите email'


        }else if(this.registerPassword.length<1){

          this.registerErrorMessage='Введите пароль'


        }else{

          //Устанавливаем данные авторизации в локальную память в менеджер состояния
          //чтобы пароль и email были доступны из других компонентов
          this.autorization.setAutorizationData(this.registerEmail,this.registerPassword);

          try{

            //Пытаемся отправить запрос на сервер
            let response=await this.axios.post('getRegistrationConfirmationCode',{

              email: this.registerEmail,
              password: this.registerPassword,

            });

            console.log(response);

            if(response.data.errorExist==true){

              if(response.data.actionMessage=='invalidEmail'){

                this.registerErrorMessage='Некорректный Email'

              }

              if(response.data.actionMessage=='userHasBeenAlreadyRegistered'){

                this.registerErrorMessage='Email уже был использован для регистрации'

              }

            }else if(response.data.actionMessage=='checkEmail'){

              //Если ошибки нет, то:

              //Записываем логин и пароль в оперативную память для их использования
              //в другом компоненте
              this.autorization.setAutorizationData(this.registerEmail,this.registerPassword);

              //Переходим на страницу ввода кода подтверждения регистрации
              this.$router.push('/confirmationRegistration');

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


      async requestToAuthorization(){
        
        if(this.enterEmail.length<1){

          this.enterErrorMessage='Введите email'


        }else if(this.enterPassword.length<1){

          this.enterErrorMessage='Введите пароль'


        }else{

          try{

            //Пытаемся отправить запрос на сервер
            let response=await this.axios.post('getAuthenticationToken',{

              email: this.enterEmail,

              password: this.enterPassword,

            });

            console.log(response);

            if(response.data.errorExist==true){

              if(response.data.actionMessage=='userNotFound'){

                this.enterErrorMessage='Пользователь не найден'

              }else if(response.data.actionMessage=='invalidPassword'){

                this.enterErrorMessage='Неверный пароль'

              }

            }else if(response.data.actionMessage=='tokenWasCreated'){

              //Если ошибки нет, то:

              //Получаем токен авторизации
              let authorizationToken=response.data.content.token;

              //Записываем новый токен авторизации в локальной памяти
              //и в оперативной памяти
              this.autorization.setAuthorizationToken(authorizationToken);

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

    }

  }

</script>

<style scoped>

  .page{

    height:100%;
    width:100%;
    padding-top:max(10%, 60px);

  }

  .logo{
    
    display:block;
    margin-left:auto;
    margin-right:auto;
    width: 80px;

  }

  .title{

    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    display: flex;
    align-items: center;
    justify-content:center;
    text-transform: capitalize;
    color: #2989A3;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width:100%;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:50px;
    font-family:'SFProTextMedium';

  }


  .selectAction{

    background: #2989A3;
    
    border-radius: 25px;
    display:flex;
    align-items:center;
    justify-content:space-around;
    width: 250px;
    height: 50px;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:30px;

  }


  .selectAction>p{

    display: flex;
    align-items: center;
    text-align: center;
    text-transform: capitalize;
    color: rgba(0, 0, 0, 0.7);
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    display: flex;
    align-items: center;
    justify-content:center;
    text-align: center;
    text-transform: capitalize;
    height: 40px;
    min-width:111px;
    padding-left:10px;
    padding-right:10px;
    border-radius: 20px;
    cursor:pointer;
     font-family:'SFProTextMedium';

  }

  .selectedAction{

   background: #D9D9D9;
   

  }

  .registrationBlock, .authorizationBlock{

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

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus {

    -webkit-box-shadow: 0 0 0px 1000px #D9D9D9 inset;
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
    text-align:center;
    margin-top:20px;
    font-family:'SFProTextMedium'; 

}

</style>
