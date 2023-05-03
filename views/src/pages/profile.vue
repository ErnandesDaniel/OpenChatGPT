<template>
  <div class="page">

    <header>

      <router-link to='/'>

        <img src='@/assets/backArrow.svg' class='profileIcon'>

      </router-link>

      <p class='title'>Профиль</p>

    </header>

   <div class='nameOfBlock'>Настройки</div>

    <div class='functionBlock'>

      <div class='function'>Оформление</div>

    </div>


    <div class='nameOfBlock'>Помощь</div>

    <div class='functionBlock'>

      <div class='function'>Поделиться с друзьями </div>
      <div class='function'>Задать вопрос </div>
      <div class='function'>Подсказки</div>

    </div>

    <div class='nameOfBlock'>Документы</div>

    <div class='functionBlock'></div>

    <div class='actionButton' v-on:click='logOutOfAuthorization'>Выйти</div>

  </div>

</template>


<script>


  import { useAutorizationStore } from '@/stores/autorization.js'

  import { useChatsStore } from '@/stores/listOfChats.js'


  import localForage from 'localforage'

  export default {



    setup() {

      const autorization=useAutorizationStore();
      const chatsStore=useChatsStore();
      return {autorization, chatsStore}

    },

    methods:{

      async logOutOfAuthorization(){

        //Устанавливаем статус авторизации на false
        this.autorization.setStatusOfAuthorization(false);

        //Удаляем токен авторизации
        this.autorization.setAuthorizationToken(null);

        //Удаляем список чатов
        this.chatsStore.deleteListOfChats();

        //Переходим на страницу авторизации
        this.$router.replace('/autorization');

      },

    },

  }

</script>


<style scoped>

  .page{

    height:100%;
    width:100%;
    padding-top:40px;


  }

  header{

    position:relative;
    display:flex;
    justify-content:center;

  }

  header>a>.profileIcon{

    position:absolute;
    left:10px;
    height:20px;
    width:auto;
    cursor:pointer;

  }


  header>.title{

    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    text-transform: capitalize;
    margin-bottom:20px;
    font-family: 'SFProTextMedium';
    font-weight: bold;


  }


.actionButton{

  display:flex;
  justify-content:center;
  align-items:center;
  border-radius:20px;
  height: 48px;
  width: 95%;
  margin-left:auto;
  margin-right:auto;


  font-style: normal;
  font-size: 18px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.7);
  background: #D8D5D5;
  cursor:pointer;
  user-select:none;
  font-family: 'SFProTextMedium';
  font-weight: bold;
  background: #E7E7E7;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

}


.nameOfBlock{

  
    line-height: 24px;
    line-height: 200%;
    padding-left: 30px;
    font-weight: bold;
    font-size: 20px;
    color:rgba(0, 0, 0, 0.5);
    font-family: 'SFProTextMedium';


  }

  .functionBlock{

    margin-left: auto;
    margin-right: auto;
    width: 95%;
    min-height: 133px;
    background: #E7E7E7;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 25px;
    margin-bottom: 20px;

  }


  .function{

    font-family: 'SFProTextMedium';
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.5);
    height: 30px;
    padding-top: 10px;
    padding-left: 20px;

  }

</style>























