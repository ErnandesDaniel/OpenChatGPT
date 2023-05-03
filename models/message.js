
//Создаем объект (модель) для работы с чатами пользователей
const messageModel = {};

//Получение данных пользователя или получение пустого пользователя
messageModel.getLatestMessages= async(email, idOfChat, numberOfMessages)=>{

	//Создаем строку запроса к базе данных для получения списка сообщений в чате пользователя
	let query = `
	
		SELECT * FROM messages
		
		WHERE idOfUser = (SELECT idOfUser FROM users WHERE Email =?)
		
		AND
		
		idOfChat = ?
		
		ORDER BY idOfMessage DESC LIMIT ? 
		
	`;

	//Получаем id пользователя из базы данных посредством запроса
	let results=await global.pool.execute(query, [email, idOfChat, numberOfMessages]);
	
	//Получаем массив с данными (первый элемент массива - данные запроса второй элелмент массива
	//поля соответствующих объектов)
	let arrayOfMessages=results[0];
	
	//Возвращаем массив чатов пользователя
	return arrayOfMessages;
	
};



// Получение данных пользователя или получение пустого пользователя
messageModel.addMessageToChatOfUser= async(email, idOfChat, message)=>{
	
	let query = `
	
		INSERT INTO messages (idOfChat, idOfUser, time, content) 


		VALUES (?, (SELECT idOfUser FROM users WHERE Email = ?),?, ?);

	`;

	//Отправляем запрос на вставку нового чата пользователя
	await global.pool.execute(query, [nameOfChat, email, message.time, message.content]);
	
	//Создаем строку запроса к базе данных для получения списка сообщений в чате пользователя
	let query = `
	
		SELECT * FROM messages
		
		WHERE idOfUser = (SELECT idOfUser FROM users WHERE Email =?)
		
		AND
		
		idOfChat = ?
		
		ORDER BY idOfMessage DESC LIMIT 1 
		
	`;

	//Получаем id пользователя из базы данных посредством запроса
	let results=await global.pool.execute(query, [email, idOfChat]);
	
	//Получаем массив с данными (первый элемент массива - данные запроса второй элелмент массива
	//поля соответствующих объектов)
	let idOfMessage=results[0][0];
	
	//Возвращаем массив чатов пользователя
	return idOfMessage;	
		

};

module.exports = messageModel;

