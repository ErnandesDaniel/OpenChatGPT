<template>

  <div class='textarea'>

    <div class='placeholder' v-if='modelValue==""'>Напишите сообщение...</div>


<div class='contentBlock'>

    <div

      class='writableBlock'

      ref="textarea"

      autofocus

      contenteditable="true"

      role="textbox"

      aria-multiline="true"

      v-on:keydown.prevent.enter.ctrl.exact="newString"

      v-on:keydown.prevent.enter.exact="sendMessage"

      v-on:paste='OnPaste($event)'

      v-on:input="OnInput($event)"

    ></div>

</div>




  </div>


</template>


<script>

  export default{

    props:{

      modelValue:String,//Значение, используемое для связывания данных
      //на компоненте с помощью v-model

    },

    //После создания компонента в DOM дереве вставляем в него подготовленный текст
    mounted(){

      this.$refs.textarea.innerText=this.modelValue;

    },

    watch:{

      modelValue(newValue){

        //При изменении значения modelValue вставляем в блок текст
        //this.autoResizeTextarea();

        if(this.$refs.textarea.innerText!=newValue){

          this.$refs.textarea.innerText=newValue;
        }

        //Записываем текст сообщения пользователя в локальную базу данных

      },

    },


    methods:{

      OnInput(event){

        //При печати символов текста отправляем сообщение родителю с текстом
        this.$emit('update:modelValue', event.target.innerText)

      },


      sendMessage(event){

        //При нажатии на кнопку обрабатываем изменение высоты текста
        this.$emit('sendMessage');

      },



      newString(event) {

        // let caret = event.target.selectionStart;
        //event.target.setRangeText("\n", caret, caret, "end");
        //this.text = event.target.value;

        //this.$refs.textarea.innerText=this.$refs.textarea.innerText+'\n'

        //const caret = this.$refs.textarea.selectionStart; // получаем позицию курсора



        //this.$refs.textarea.innerHTML=this.$refs.textarea.innerHTML+"<br>"; // вставляем пустую строку


        //textarea.value += "\n";
        

        //this.$refs.textarea.innerText += "\n";

        console.log('добавить новую строку');
      },


      OnPaste(event){

        //Разрешаем вставлять тольк текст в блок (удаляем все теги из блока)
        console.log(event);
        const pastedText = event.clipboardData.getData('text');
        event.preventDefault();
        document.execCommand('insertHTML', false, pastedText);
        //При вставке текста отправляем сообщение с текстом
        this.$emit('update:modelValue', event.target.innerText)

      },

    },

    data(){

      return{

        textareaHeight:0,

        maxHeightOfTextarea:150,

      }
    },

  }

</script>


<style>


   .textarea{

    width:calc(100% - 60px);
    min-width:200px;
    max-height:150px;

  }

  .contentBlock{

    width:100%;
    height:100%;
    height:auto;
    width:100%;
    min-width:200px;
    font-size:16px;
    background:rgba(41, 137, 163, 0.7);
    border-radius:25px;
    display:flex;
    justify-content:center;
    align-items:center;


  }

  .writableBlock{

    width:calc(100% - 40px);
    height:100%;
    min-height:40px;
    max-height:150px;
    padding-top:10px;
    padding-bottom:10px;
    font-size:16px;
    overflow:auto;
    word-wrap:break-word;
  }


  .placeholder{

    position:absolute;
    left:28px;
    top:21px;
    z-index:10;
    user-select:none;
    pointer-events:none;
    color:white;
    font-size:16px;

  }

  
</style>