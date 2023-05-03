
import { defineStore } from 'pinia'

//Импортируем хранилище авторизации
import { useAutorizationStore  } from './autorization.js'

export const useSocketConnectionStore = defineStore('socketConnection',{
	
	state:()=>{
		
		return{

			webSocketConnection:null,//Объект для сохранения соединения через сокеты

			requestsList:[],//список запросов на сервер

			connectionFixed:false,//Соединение фиксированно или нет

		}
		
	},
	
	actions:{

		//Функция для загрузки списка запросов из локальной базы данных
		//в оперативную память

		downloadRequests(){




		},


		//Функция для добавления запроса в очередь
		addRequest(request){

			//Если сокет соединение не фиксировано - оборвано или
			//не авторизовано, то сохраняем запрос в локальную базу данных
			if(this.connectionFixed==false){


				
			}else{//Иначе выполняем запрос

				//Получаем доступ к хранилищу
				const socketConnectionStore=useSocketConnectionStore();

				//Отправляем очередь запросов
				socketConnectionStore.sendListOfRequests();

			}


		},


		//Функция отправки очереди запросов на сервер
		sendListOfRequests(){
			//Из оперативной памяти получаем запросы и отправляем на сервер





		},

		//Данные необходимые для подтверждения email - email,
		//password - используетя только для подтверждения регистрации пользователя
		connectToSocketServer(){

			//Получаем доступ к хранилищу авторизации
			const autorizationStore = useAutorizationStore();

			//this.webSocketConnection=new WebSocket("ws://"+window.location.host);

			this.webSocketConnection=new WebSocket("ws://"+'localhost:448');
			//this.webSocketConnection=new WebSocket("ws://"+'188.134.77.106:448/');

			//Определяем функцию для отправки сообщения клиенту в виде объекта
			this.webSocketConnection.sendObject=(object)=>{
			
				this.webSocketConnection.send(JSON.stringify(object));
				
			};


			//При открытии соединения обрабатываем его
			this.webSocketConnection.onopen=(event)=>{

				console.log('Попытка установить соединение')

				this.webSocketConnection.sendObject({

					actionMessage:'autorization',

					content:{

						authorizationToken:autorizationStore.authorizationToken,

					},
					

				});

			};

			//Обработка получения сообщений
			this.webSocketConnection.onmessage=(event)=>{

				let data=JSON.parse(event.data);

				console.log(data);

				//Если ответное сообщение означает, что
				// только что успешно прошла авторизация, то
				//выполняем соответствующие действия
				if(data.actionMessage=='authorizationWasSuccessful'){

					console.log('Соединение установлено');

					//Пишем, что соединение установлено
					this.connectionFixed=true;

					//Получаем доступ к хранилищу
					const socketConnectionStore=useSocketConnectionStore();

					//Загружаем в оперативную память из локальной базы данных 
					//очередь запросов на сервер
					socketConnectionStore.downloadRequests();

					//Отправляем очередь запросов на сервер
					socketConnectionStore.sendListOfRequests();
					
				}

			};

			//Обработка закрытия сообщения - попытка восстановить соединение каждую секунду
			this.webSocketConnection.onclose=(event)=>{

				console.log('Разрыв соединения');

				//Указываем, что соединение разорвано
				this.connectionFixed==false;

				setTimeout(()=>{

					//При каждом разрыве соединения с сервером пытаемся 
					//восстановить соединение каждую секунду
					this.connectToSocketServer();

				},1000);

			};

		}

	},

});