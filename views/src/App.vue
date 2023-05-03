<template>

  <router-view/>

</template>

<script>

  import { useAutorizationStore } from '@/stores/autorization.js'
  import { useChatsStore } from '@/stores/listOfChats.js'
  import { useSocketConnectionStore } from '@/stores/socketConnection.js'
  import localForage from 'localforage'
  
  export default{

    setup() {

      const autorization=useAutorizationStore();
      const chatsStore=useChatsStore();
      const socketConnection=useSocketConnectionStore();

      return {autorization, chatsStore, socketConnection}

    },

    data(){

      return{

        tokenAutentification:'',//Токен аутентификации

      }

    },

    created(){

      //При загрузке страницы устанавливаем дефолтные значения для локальной памяти, если
      //они были сброшены

      if(JSON.parse(localStorage.getItem('statusOfAuthorization'))==null){

        localStorage.setItem('statusOfAuthorization', JSON.stringify(false));

      }


      if(JSON.parse(localStorage.getItem('authorizationSelectedBlock'))==null){

        localStorage.setItem('authorizationSelectedBlock', JSON.stringify('registration'));

      }


      if(JSON.parse(localStorage.getItem('authorizationToken'))==null){

        localStorage.setItem('authorizationToken', JSON.stringify(null));

      }

      //Если список чатов пуст, то создаем его
      localForage.getItem('chatGPT_ListOfChats').then((value)=>{

        if(value==null){

          localForage.setItem('chatGPT_ListOfChats',[]);
          
        }

      });

      //Загружаем данные о состоянии авторизации пользователя из локальной памяти в оперативную
      this.autorization.downloadStatusOfAuthorization();

      if(this.autorization.statusOfAuthorization==false){

        //Если пользователь не авторизован, то устанавливаем для него выделенный блок
        //на странице авторизации, который был до этого
        this.autorization.downloadAuthorizationSelectedBlock();

        //alert('пользователь не авторизован');

      }else{

        //Если авторизация успешна, то:

        //Загружаем токен авторизации
        this.autorization.downloadAuthorizationToken();

        //Загружаем список чатов из локальной памяти
        this.chatsStore.downloadListOfChatsFromLocalForage();

        //Пытаемся в цикле каждую секунду подключиться к серверу по webSocket
        this.socketConnection.connectToSocketServer();

      }

    },

  }

</script>

<style scoped>



  @font-face {
    font-family: 'SFProTextMedium'; 
    src: url(@/assets/fonts/SanFrancisco/SFProTextMedium.otf); 
  }

  @font-face {
    font-family: 'SFProTextRegular'; 
    src: url(@/assets/fonts/SanFrancisco/SFProTextRegular.otf); 
  }

  #app {

    width:100%;
    height:100%;
    font-family:'SFProTextMedium';

  }


  
</style>
