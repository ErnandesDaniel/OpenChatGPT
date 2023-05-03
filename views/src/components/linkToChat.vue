<template>

  <div class='linkToChat' v-bind:class='{linkToChatPC:isMobile==false}'>

    <div class='content' v-on:click='goToChat'>

        <div class='topLine'>
          <p class='nameOfChat'>{{chatObject.nameOfChat}}</p>
          <p class='time'>{{timeOfLastMessageView}}</p>
          <p class='deleteChatIcon' v-on:click.stop='deleteChat'>&#10006</p>
        </div>

        <div class='bottomLine'>
          <p class='lastMessage'>{{chatObject.lastMessage}}</p>
        </div>

    </div>

    <div class='deleteChatButton' v-on:click='deleteChat'></div>

  </div>

</template>

<script>

import { useChatsStore } from '@/stores/listOfChats.js'

export default {

  setup() {

    const chatsStore=useChatsStore();
    return {chatsStore}

  },

  props:{

    chatObject:Object,

    isMobile:Boolean,

    //Записать печатает chatGPT в чате или нет

  },

  methods:{

    goToChat(){

      this.$router.push('chat/'+this.chatObject.IDOfChat);

    },

    async deleteChat(event){

      //Удаляем чат из локальной базы данных и оперативной памяти
      await this.chatsStore.removeChat(this.chatObject.IDOfChat);
    },

  },

  computed:{

    timeOfLastMessageView(){

      //Получаем метку времени сейчас 
      let now = new Date();

      //Получаем метку времени из числа времени сообщения
      let lastMessageDate = new Date(this.chatObject.timeOfLastMessage);

      // Если время последнего сообщения было сегодня, то выводим только время - часы, минуты
      if (lastMessageDate.getDate() === now.getDate()) {

        return lastMessageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      // Если время последнего сообщения было вчера или в другом дне этого месяца, 
      //то указываем дату получения этого сообщения и время

      if (lastMessageDate.getMonth() === now.getMonth()){

        return lastMessageDate.toLocaleString([], { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

      }

      if (lastMessageDate.getYear() != now.getYear()){

        return lastMessageDate.toLocaleString([], { year: 'numeric', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

      }

    },

  },

}

</script>

<style scoped>

  .linkToChat{

    width:100%;
    height:85px;
    border-width:0px 0px 1px 0px;
    border-style:solid;
    border-color:rgba(41, 137, 163, 1);
    cursor:pointer;
    display:flex;
    overflow-y:hidden;
    overflow-x:scroll;

  }

  /* для Chrome/Edge/Safari */
  .linkToChat::-webkit-scrollbar {
    height: 0px;
  }

  .content{

    height:100%;
    width:100%;
    flex-shrink:0;

  }

  .topLine{

    display:flex;
    position:relative;
    height:50%;

  }


  .nameOfChat{
    
    margin-top:7px;
    margin-left:10px;
    background: rgba(231, 231, 231, 1);
    border-radius: 14px;
    font-family:'SFProTextMedium'; 
    padding-top:3px;
    padding-bottom:3px;
    padding-left:10px;
    padding-right:10px;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    height:min-content;

  }

  .time{

    position:absolute;
    right:10px;
    top:10px;
    font-family: 'SFProTextRegular';

  }

  .deleteChatIcon{

    display:none;

  }


  .bottomLine{

    height:50%;

  }

  .lastMessage{

    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 15px;
    margin-left:20px;
    margin-right:20px;

  }



  .deleteChatButton{

    height:100%;
    width:100px;
    background:red;
    flex-shrink:0;

  }



/*CSS код для компьютера */


  .linkToChatPC{

    overflow-y:hidden;
    overflow-x:hidden;

  }


  .linkToChatPC:hover .time{

    display:none;

  }

  .linkToChatPC:hover .deleteChatIcon{
    display:block;
    position:absolute;
    right:10px;
    top:10px;

  }

  .linkToChatPC .deleteChatIcon:hover{

    font-weight:bold;
    font-size:16px;

  }

</style>
