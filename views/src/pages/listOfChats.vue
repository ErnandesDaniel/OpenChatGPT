<template>

  <div class='page'>

    <header>

      <router-link to='/profile'>

        <img src='@/assets/profileIcon.svg' class='profileIcon'>

      </router-link>

      <p class='title'>Чаты</p>

    </header>

    <input type='text' placeholder='Поиск чата' class='searchForChats' v-model='searchChat'>

    <div class='listOfChats'>

      <linkToChat v-for='chat in ListOfChats'

        :chatObject='chat'

        :key="chat.IDOfChat"

        :isMobile='isMobile'

      />

    </div>

   <button class='createNewChat' v-on:click='createNewChat'>Новый чат</button>

  </div>

</template>

<script>

import linkToChat from '@/components/linkToChat.vue'
import { useMainDataStore } from '@/stores/mainData.js'
import { useChatsStore } from '@/stores/listOfChats.js'

export default {

  components:{

    linkToChat,

  },

  setup() {

    const mainData=useMainDataStore();
    const chatsStore=useChatsStore();
    return {mainData, chatsStore}

  },

  data(){
    return{

      searchChat:'',
      isMobile:true,

    }
  },



  created(){

    //Узнаем состояние того, пользователь зашел с ПК или с мобильного устройства
    this.updateUserAgent();

    //Устаналвиваем слушатель события, для проверки агента пользователя
    window.addEventListener('resize', this.updateUserAgent);

    //Делаем запрос на получение списка чатов

  },

  destroyed() {

    window.removeEventListener('resize', this.updateUserAgent);

  },

  computed:{


    ListOfChats(){

      //Эта функция фильтрации проверяет каждый объект массива на соответствие введенному имени.
      //Если имя объекта содержит введенную строку, то функция возвращает `true`, и объект сохраняется в новом массиве . 

      //Если имя объекта не содержит введенную строку, то функция возвращает `false`, и объект не сохраняется в новом массиве.
      let ListOfChats=[];

      ListOfChats=this.chatsStore.ListOfChats.filter((element)=>{

      //indexOf() возвращает индекс первого вхождения значения в строке. 
      //Если значение не найдено, то метод возвращает -1.

        //Изменяем буквы в названии чата на нижний регистр
        return element.nameOfChat.toLowerCase().replace(/ /g, "").includes(
          //Изменяем буквы в вводимом названии на нижний регистр
          this.searchChat.toLowerCase().replace(/ /g, "")

        );

      });

      //Сортируем массив по времени последнего активного действия

      //Функция сравнения должна возвращать отрицательное число, если первый аргумент меньше второго, положительное число, если первый аргумент больше второго, и 0, если они равны.

      ListOfChats.sort(

        (firstChat, secondChat)=>{return secondChat.timeOfLastMessage-firstChat.timeOfLastMessage;}

      );

      return ListOfChats;
    },

  },


  methods:{

    //Функция для обновления проверки состояния того, сайт открыт с мобильного устройства
    //или с персонального компьютера
    updateUserAgent(){

      let userAgent = navigator.userAgent;
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    },

    async createNewChat(){
        //Создаем новый чат в локальной базе данных и в оперативной памяти
        let newIDOfChat=await this.chatsStore.addNewChatInListOfChats();
        //Добавляем задачу для отправки на сервер - создание нового чата
        //Переходим в новый чат
        this.$router.push('chat/'+newIDOfChat);

    },

  }


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

  }



  .searchForChats{

    width: 93%;
    height: 35px;
    background: #2989A3;

    border-radius: 30px;
    font-family: 'SFProTextMedium';
    text-align:center;
    display:block;
    margin-left:auto;
    margin-right:auto;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
   
    line-height: 19px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'case' on;
    padding-left:10px;
    padding-right:10px;



  }

  .searchForChats::placeholder{

    color: white;
 
  }


  .listOfChats{

    margin-top:15px;
    overflow:auto;
    border-width:1px 0px 0px 0px;
    border-style:solid;
    border-color:#2989A3;;
    height:auto;

  }
.createNewChat{


    font-family: 'SFProTextMedium';


    position:fixed;
    
    bottom:45px;
    background: #2989A3;
    border-radius: 20px;
    font-size:15px;
    
    width:50%;
    text-align:center;
    height:39px;
    margin-left:auto; 
    margin-right:auto;
    height: 40px;
    left: 0px;
    right: 0px;
    bottom: min(10%,100px);

    color: #FFFFFF;
 }

</style>
