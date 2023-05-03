<template>

  <div class='page'>

    <header>
      
      <img 

      src='@/assets/backArrow.svg' v-on:click='backToListOfChats' 

      class='backToListOfChats'>

      <p class='NameOfChat'>{{nameOfChat}}</p>

    </header>


    <div class='ListOfMessages'>

      <div class='message' v-for='message in messages'>

        <div 

          class='content'

          v-bind:class="{ sendFromBot: message.role=='assistant', sendFromUser: message.role=='user'}">

          <p>
            {{message.content}}
          </p>

        </div>

      </div>

    </div>

    <div class='sendMessageBlock'>

      <textareaAutosize

        v-model="userText"

        v-on:sendMessage='sendMessage'

      />

      <div

        class='sendMessageButton'

        v-bind:class="{ disabledSendMessageButton: waitingForResponse==true}"

        v-on:click='sendMessage'

      >

        <img

          v-bind:src="require('@/assets/'+sendMessageButtonIconName+'.svg')"


        />
      </div>

    </div>

  </div>

</template>

<script>

import textareaAutosize from "@/components/textareaAutosize.vue"

export default {

  components:{

    textareaAutosize,

  },

  created(){

    //Делаем запрос на получение информации из чата

    //Если нет доступа к серверу, то указываем, что есть проблемы с интерентом

  },

 data(){

    return{


      nameOfChat:'Новый чат',

      //baseURL: 'http://localhost:448/api/',

      baseURL:window.location.origin+'/api/',

      //process.env.VUE_APP_API_PORT

      messages:[

        /*{content:'Расскажи о США', role:'user'},

        {content:'Первое сообщение от робота Атомы состоят из ядра и электронов (точнее, электронного «облака»). Ядро атома состоит из протонов и нейтронов. Количество нейтронов в ядре может быть разным: от нуля до нескольких десятков. Если число электронов совпадает с числом протонов в ядре, то атом в целом оказывается электрически нейтральным. В противном случае он обладает некоторым положительным или отрицательным зарядом и называется ионом.Первое сообщение от робота Атомы состоят из ядра и электронов (точнее, электронного «облака»). Ядро атома состоит из протонов и нейтронов. Количество нейтронов в ядре может быть разным: от нуля до нескольких десятков. Если число электронов совпадает с числом протонов в ядре, то атом в целом оказывается электрически нейтральным. В противном случае он обладает некоторым положительным или отрицательным зарядом и называется ионом.', role:'assistant'},*/

        ],

      userText:'',

      waitingForResponse:false,

    }

  },

  computed:{


    sendMessageButtonIconName(){

      if(this.userText!=''){

        return 'sendMessageArrow';


      }else if(this.userText==''){

        return 'microphone';

      }


    }

  },

  watch:{

    messages(oldValue, newValue){

    //При посылке сообщения роботу сдвигаем скролл в списке сообщений в чате самый низ

      console.log(newValue.length);

    }

  },


  methods:{

    backToListOfChats(){

      //При нажатии на эту кнопку переходим к списку чатов
      this.$router.replace('/');

    },

    //Посылаем сообщение chatGPT и получаем ответ

       async sendMessage(){

        if(this.waitingForResponse==false && this.userText.length>0){
          //Указываем, что пользователь ждет ответа - запретить
          //посылать новые сообщения роботу
          this.waitingForResponse=true;

          //Записываем сообщение пользователя в локальную переменную
          let userText=this.userText;

          //Удаляем сообщение пользователя из интерфейса, очищая глобальную переменную
          this.userText='';

          //Отображаем сообщение пользователя в интерфейсе
          this.messages.push({content:userText, role:'user'});

          //Пытаемся получить ответ от сервера
          try {


            //Указываем url для отправки
            let url = this.baseURL+'getStreamResponse';


            //Отправляем сообщение пользователя и ожидаем ответа от сервера
            // Шаг 1: начинаем загрузку fetch, получаем поток для чтения
            let response = await fetch(url,{method: 'POST', 

              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify({listOfMessages:this.messages})

            });

            //После отправки запроса на сервер создаем блок для ответа робота
            //Отображаем пока что пустое сообщение бота в интерфейсе
            this.messages.push({content:'', role:'assistant'});

            //Создаем объект для чтения данных
            const reader = response.body.getReader();

            // Шаг 3: считываем данные:
            let textOfResponse='';//Текст ответа
            //Выполняем цикл, пока поток не завершится
            while(true) {

              //Получаем новую часть ответа из потока
              const {done, value} = await reader.read();

              //Преобразуем данные в буквы
              let text=new TextDecoder("utf-8").decode(value);

              //Получаем текст ответа
              textOfResponse=textOfResponse+text;

              //Записываем нынешний текст ответа в интерфейсе
              this.messages[this.messages.length-1].content=textOfResponse;


                if (done) {

                  //Если поток завершен, то позволяем пользователю отправлять
                  //дальнейшие запросы на сервер:
                  //Указываем, что больше пользователь не ожидает ответа
                  this.waitingForResponse=false;
                  //Обрываем цикл
                  break;
                }

            }

          } catch(err) {

              //В случае возникновения ошибки  указываем пользователю, что он может
              //дальше посылать сообщения
              //Указываем, что пользователь ждет ответа - запретить
              //посылать новые сообщения роботу
              this.waitingForResponse=false;

              //Удаляем последнее пустое сообщение от бота - изменяем массив, удаляя
              //последнее сообщение

              if(this.messages[this.messages.length-1].role!='user'){

                this.messages.splice(this.messages.length-1);

              }

            }

        }

      }

  }

}


</script>

<style scoped>

.page{

  height:100%;
  width:100%;

}

/*

header{

  display:flex;
  align-items:center;
  height:50px;
  border-color:rgba(82, 119, 148, 0.9);
  border-style:solid;
  border-bottom-width:1px;

}

header>.backToListOfChats{

  height:24px;
  width:auto;
  margin-left:10px;
  cursor:pointer;

}

header>.NameOfChat{

  margin-left:5px;
  width:90%;
  text-align:center;

}

*/


header{

  display:flex;
  align-items:center;
  height:50px;
  border-color:rgba(82, 119, 148, 0.9);
  border-style:solid;
  border-bottom-width:1px;

}

header>.backToListOfChats{

  height:24px;
  width:auto;
  margin-left:10px;
  cursor:pointer;
  position: absolute;

}

header>.NameOfChat{


  font-family: 'SFProTextMedium'; 
  margin-left:auto;
  margin-right:auto;
  font-size: 16px;
  font-weight: 600;


}
/*

.sendMessageBlock{

  position:absolute;
  bottom:5px;
  width:100%;
  max-height:170px;
  min-height:70px;
  display:flex;
  justify-content:center;
  border-color:rgba(41, 137, 163, 0.9);
  border-top-width:1px;
  border-style:solid;
  padding-top:10px;
  padding-bottom:10px;
  background:white;
  font-family: 'SFProTextRegular'; 
 

}

.sendMessageBlock>.sendMessageButton{

  font-size:20px;
  width:30px;
  margin-left:5px;
  border-radius:10px;
  background: #D9D9D9;
  display:flex;
  align-items:center;
  justify-content:center;
  height:40px;
  width:40px;
  cursor:pointer;

}

.sendMessageBlock>.disabledSendMessageButton{

  background:gray;

}

.sendMessageBlock>.sendMessage>img{

  width:24px;
  height:auto;

}



*/



.sendMessageBlock{

  position:absolute;
  bottom:5px;
  width:100%;
  max-height:170px;
  min-height:70px;
  display:flex;
  justify-content:center;
  border-color:rgba(41, 137, 163, 0.9);
  border-top-width:1px;
  border-style:solid;
  padding-top:10px;
  padding-bottom:10px;
  background:white;
  font-family: 'SFProTextRegular'; 
 


}



.sendMessageBlock>.sendMessageButton{

  font-size:14px;
  width:30px;
  margin-left:5px;
  border-radius:20px;
  background: #D9D9D9;
  display:flex;
  align-items:center;
  justify-content:center;
  height:40px;
  width:40px;
  cursor:pointer;

}

.sendMessageBlock>.disabledSendMessageButton{

  background:gray;

}

.sendMessageBlock>.sendMessage>img{

  width:24px;
  height:auto;

}

.ListOfMessages{

  padding-top:20px;
  padding-bottom:20px;
  max-height:calc(100% - 120px);
  height:100%;
  overflow-y:auto;

}


.ListOfMessages>.message{

  min-height:30px;
  width:100%;
  margin-bottom:20px;
  display:flex;
  justify-content:flex-end;
  font-size:20px;

}

.ListOfMessages>.message>.content{

  width:100%;
  display:flex;
  
}

.sendFromBot{

  justify-content:start;
  padding-left:10px;

}

.sendFromBot>p{

 background: #D9D9D9;
 padding-left:5px;

}

.sendFromUser{

  text-align:end;
  justify-content:flex-end;
  padding-right:10px;

}
.sendFromUser>p{

  background: rgba(41, 137, 163, 0.7);
  padding-right:5px;

}

.ListOfMessages>.message>.content>p{

    max-width:80%;
    padding-top:10px;
    padding-left:10px;
    padding-right:10px;
    padding-bottom:10px;
    border-radius: 20px;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 15px;
    white-space: pre-line;
    word-wrap:break-word;

}


</style>
