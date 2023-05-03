<template>

	<div class='message' v-bind:style='typeOfSenderStyle'>

		<p class='text'>{{text}}</p>

		<p class='time'>{{time}}</p>

	</div>

</template>

<script>
export default {

	props:{

		text:String,
		time:String,
		typeOfSenderStyle:String,

	},

	data(){

		return{



		}

	},

	computed:{
		//Создаем стиль для отображения типа сообщения - сообщение пользователя или ИИ
		typeOfSenderStyle(){

			let style;

			if(this.typeOfSender=='user'){

				style={


					backround:'yellow',
				}

			}else if(typeOfSender=='AI'){

				style={


					backround:'green',

				}

			}

			return style;

		}

	},

}

</script>

<style scoped>

.message{



}


.text{

	font-size:20px;

}


.time{

	font-size:14px;

}

</style>
