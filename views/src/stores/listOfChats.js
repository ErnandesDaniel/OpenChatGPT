
import localForage from 'localforage'
import { defineStore } from 'pinia'


//Импортируем хранилище авторизации
import { useSocketConnectionStore  } from './socketConnection.js'


export const useChatsStore = defineStore('chats',{
	
	state:()=>{
		
		return{

			ListOfChats:[

			/*//Общая информационная схема объекта чата
				{

					IDOfChat:'FSADFASDFASF',//ID чата
					nameOfChat:'Новый чат',//Имя чата
					lastMessage:'',//Последнее сообщение, отображаемое в чате
					timeOfLastMessage:0,//Время последнего сообщения в эпохе Unix
					//Под сообщением может подразумеваться время создания чата
					//Это равнозначные понятия
					
				},

			*/
				
			]

		}
		
	},
	
	actions:{

		async synchronizeWithServer(request){

			//Получаем доступ к хранилищу авторизации
			const socketConnectionStore = useSocketConnectionStore();

		},


		async downloadListOfChatsFromLocalForage(){

			//Получаем объект всех чатов из локальной базы данных
			let ListOfChats= await localForage.getItem('chatGPT_ListOfChats');

			this.ListOfChats=ListOfChats;

		},


		async getListOfChats(){




			//Получаем объект всех чатов из локальной базы данных
			return await localForage.getItem('chatGPT_ListOfChats');

		},

		async updateListOfChats(updatedListOfChats){

			//Обновляем массив чатов в оперативной памяти
			this.ListOfChats=updatedListOfChats;

			//Обновляем массив чатов в локальной базе данных
			await localForage.setItem('chatGPT_ListOfChats',updatedListOfChats);

		},

		async addNewChatInListOfChats(){

			//Создаем ID для нового чата
			let newIDOfChat=Math.floor(Math.random() * 100000);

			//Получаем список всех чатов из локальной базы данных
			let ListOfChats=await this.getListOfChats();

			//Добавляем в массив списка чатов еще один элемент
			ListOfChats.push({

				IDOfChat:newIDOfChat,//ID чата
				nameOfChat:'Новый чат',//Имя чата
				lastMessage:null,//Последнее сообщение, отображаемое в чате
				timeOfLastMessage:Date.now(),//Время создания объекта чата в эпохе Unix

			});
			
			this.updateListOfChats(ListOfChats);

			return newIDOfChat;

		},


		async updateChat(updateChatObject){

			//Получаем доступ к хранишищу
			const сhatsStore = useChatsStore();

			//Получаем список всех чатов из локальной базы данных
			let ListOfChats=await сhatsStore.getListOfChats();

			//Находим в массиве чат с переданным ID
			const indexOfChat = ListOfChats.findIndex(chat=>chat.IDOfChat===updateChatObject.IDOfChat); 
			
			// Если элемент найден, то обновляем его свойства
			if (indexOfChat !== -1) {

				//Перебираем в цикле обновляемые свойства объекта
				for(let key in updateChatObject) {

					//Обновляем свойства (которые указаны для обновления) в объекте чата
					ListOfChats[indexOfChat][key]=updateChatObject[key];
				

				}

			}

			сhatsStore.updateListOfChats(ListOfChats);

		},


		async removeChat(IDOfChat){

			//Получаем доступ к хранишищу
			const сhatsStore = useChatsStore();

			//Получаем список всех чатов из локальной базы данных
			let ListOfChats=await сhatsStore.getListOfChats();

			//alert(ListOfChats)

			//Находим в массиве чат с переданным ID
			const indexOfChat = ListOfChats.findIndex(chat=>chat.IDOfChat===IDOfChat); 

			// Если элемент найден, то обновляем его свойства
			if (indexOfChat !== -1) {

				//Удаляем элементы начиная с индекса indexOfChat, один элемент удаляем
				ListOfChats.splice(indexOfChat , 1);

			}

			сhatsStore.updateListOfChats(ListOfChats);

		},



		async deleteListOfChats(){

			this.updateListOfChats([]);

		},
		
	},

})