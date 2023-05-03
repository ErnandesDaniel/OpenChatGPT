
//Подключаем модуль с функциями для работы с токенами
const authenticationTokens = require('../authenticationTokens.js');

//Подключаем модуль с классом для создания и работы с подключением пользователя
const clientConnection = require('../clientConnection.js');


//Создаем массив подключений авторизованных клиентов
let authorizedClientsConnections=[];

//Создаем массива неавторизованных клиентов
let unAuthorizedClientsConnections=[];

//Создаем функцию, работающую интервально для удаления неавторизованных клиентов
//каждый несколько секунд для защиты от множества подклчений


//Создаем функцию для удаления отключенного пользователя


let deleteInactiveUser=(arrayOfUserConnections, email)=>{

	//Находим индекс элемента подключения пользователя
	//в массиве подключенных пользователей для удаления по email
	let indexOfClientConnection=
	arrayOfUserConnections.findIndex(clientConnection => clientConnection.email == email);

	//Если элемент найден, то его индекс не будет равен -1
	if (indexOfClientConnection!==-1){

		//Удаляем из массива подключенных пользователей неактивного пользователя
		arrayOfUserConnections.splice(indexOfClientConnection, 1);

	}

};




let webSocketController={};

//Определяем обработчик для подключений по веб-сокет серверу
webSocketController.connection=async(webSocketConnection,req)=>{
	
	//Создаем ID для нового веб-сокет подключения
	let newIDOfWebSocketConnection=Math.floor(Math.random() * 100000);
	
	//Добавляем к веб-сокет подключению уникальный ID
	webSocketConnection.id=newIDOfWebSocketConnection;
	
	//Определяем функцию для отправки сообщения клиенту в виде объекта
	webSocketConnection.sendObject=(object)=>{
	
		webSocketConnection.send(JSON.stringify(object));
		
	};

	//Добавляем соединение в массив соединений неавторизованных пользователей
	unAuthorizedClientsConnections.push(webSocketConnection);
	
	//Обработка получения сообщений авторизации
	webSocketConnection.onmessage=(event)=>{
		
		console.log(event.data);
		
		let data=JSON.parse(event.data);
		
		if(data.actionMessage=='autorization'){
			
			console.log('Попытка установить соединение');
			
			//Получаем токен авторизации
			const authToken = data.content.authorizationToken;	
					
			//Проверямем токен авторизации
			let tokenIsValid=authenticationTokens.checkToken(authToken);
			
			if (tokenIsValid==false){
			
				console.log('соединение разорвано');			
				
				//Отправляем пользователю сообщение об ошибке
				webSocketConnection.sendObject({errorExist:true, actionMessage:'invalidTokenAutorization'});
				
				//Так как токен недействителен, то закрываем соединение
				webSocketConnection.close();
				
			}else if (tokenIsValid==true){
				
				console.log('соединение подтверждено');
				
				//Отправляем пользователю сообщение об успешном подключении
				webSocketConnection.sendObject({errorExist:false, actionMessage:'authorizationWasSuccessful'});
				
				//Если токен пользователя действителен, то

				//Проверяем есть ли уже подключенный пользователь с таким же логином (подключен пользователь из этого же аккаунта):

				//Получаем email пользователя
				let email=authenticationTokens.getDecodedToken(authToken).email;

				//Проверям есть ли онлайн пользователь с таким же email

				//Ищем объект соединения пользователя с email совпадающим с полученным из токена
				let searchedClientConnection = authorizedClientsConnections.find(
				
					clientConnection => clientConnection.email == email
				
				);

				//Если пользователь найден, то у нас имеется минимум 2 его онлайн страницы (мобильного приложения)
				if(searchedClientConnection!=null){
					
					//Добавляем новое соединение данного пользователя
					searchedClientConnection.addWebSocketConnection(webSocketConnection);
					
				//Если данный пользователь еще не имеет страниц онлайн, то создаем объект подключения пользователя
				}else if(searchedClientConnection==null){

					//Создаем объект подключения пользователя с данным email
					//указываем в нем ссылки на массив всех подключенных пользователей
					//и на функцию для удаления неактивного пользователя
					let newClientConnection=
					new clientConnection(email, authorizedClientsConnections, deleteInactiveUser);
					
					//Добавляем в массив сокет-подключений пользователя веб-сокет-подключение
					newClientConnection.addWebSocketConnection(webSocketConnection);
					
					//Удаляем пользователя из массива подключенных неавторизованных клиентов
					
					//Получаем ID соединения, которое нужно удалить
					idOfWebSocketConnection=webSocketConnection.id;
					
					//Находим индекс веб-сокет соединения, которое нужно удалить из массива
					//неавторизованный пользователей
					//Если элемент не найден, метод `findIndex()` вернет `-1`.
					indexOfWebSocketConnectionToBeDeleted=unAuthorizedClientsConnections.findIndex(
						
						webSocketConnection => webSocketConnection.id == idOfWebSocketConnection
						
					);
					
					//Если элемент найден (найден индекс искомого элемента), то 
					//удаляем ссылку на него из массива
					if(indexOfWebSocketConnectionToBeDeleted>-1){
						
						//Удаляем только что авторизованного клиента 
						//из массива подключенных неавторизованных клиентов
						unAuthorizedClientsConnections.splice(
						
							indexOfWebSocketConnectionToBeDeleted, 1
						
						);
						
					}
					
					//Добавляем соединение клиента в массив подключенных авторизованный клиентов
					authorizedClientsConnections.push(newClientConnection);
					
				}
				
			}
			
		}

	};
	

	
};


//Экспортируем контроллер для веб-сокет подключений
module.exports=webSocketController;
