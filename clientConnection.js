
//Создаем функцию для прослушивания сообщений
//Передаем в нее сообщение и объект подключения
let messageHundler=(message, clientConnection)=>{
	
}


class clientConnection{
	
	//Массив чатов, в которых сейчас chatGPT что-то печатает
	chatsOnline=[];
	
	//Массив сокет-соединений с разными страницами (мобильными приложениями) пользователя
	arrayOfWebSocketConnections=[];

	//Функция для удаления из массива пользователей неактивного пользователя
	deleteInactiveUser=()=>{};

	//Ссылка на массив всех подключенных пользователей
	linkToArrayOfUserConnections=[];
	
	constructor(email, linkToArrayOfUserConnections, deleteInactiveUser){
		
		this.email = email;
		
		//Записываем ссылку на массив подключенных пользователей
		this.linkToArrayOfUserConnections=linkToArrayOfUserConnections;

		//Записываем ссылку на функцию для удаления подключенного пользователя по его email
		this.deleteInactiveUser=deleteInactiveUser;

		console.log('Создан объект для связи с пользователем');

	}
	
	//Метод для добавления нового сокет-подключения пользователя
	addWebSocketConnection(webSocketConnection){
		
		//Назначение обработчика сообщений от клиента
		webSocketConnection.onmessage=(event)=>{
			
			let data=JSON.parse(event.data);

			console.log(data);
			
			messageHundler(data, this);
			
		};

		//Устанавливаем обработчик события разрыва веб-сокет соединения
		webSocketConnection.onclose=(event)=>{

			console.log('Соединение закрыто ', webSocketConnection.id);

			//Получаем id закрытого соединения
			let idOfElementToDelete=webSocketConnection.id

			//Находим индекс веб-сокет подключения в массиве
			//с данным id
			let indexOfClosedWebSocketConnection= 
			this.arrayOfWebSocketConnections.findIndex(socket => socket.id===idOfElementToDelete)

			//Если элемент найден, то его индекс не будет равен -1
			if (indexOfClosedWebSocketConnection!==-1){

				//Удаляем из массива оборванное веб-сокет подключение
				this.arrayOfWebSocketConnections.splice(indexOfClosedWebSocketConnection, 1);

			}

			console.log(this.arrayOfWebSocketConnections);

			//Если после всех действий не осталось подключенных страниц пользователя
			if(this.arrayOfWebSocketConnections.length==0){

				//то удаляем объект подключения пользователя к серверу
				this.deleteInactiveUser(this.linkToArrayOfUserConnections, this.email);

			}

		};

		
		//Добавляем веб-сокет подключение в массив подключений данного пользователя
		this.arrayOfWebSocketConnections.push(webSocketConnection);

		if(this.arrayOfWebSocketConnections.length>1){

			console.log('Очередное веб-сокет подключение было установлено');

		}else{

			console.log('Первое веб-сокет подключение было установлено');

		}
		
	};
		
}

//Экспортируем объект маршрутизации
module.exports=clientConnection;
