
//Создаем объект (модель) для работы с чатами пользователей
const chatModel = {};

// Получение данных пользователя или получение пустого пользователя
chatModel.getAllChatsOfUser= async(email)=>{

	//Создаем строку запроса к базе данных для получения списка чатов пользователя
	let query = `SELECT * FROM chats WHERE idOfUser = (SELECT idOfUser FROM users WHERE Email =?)`

	//Получаем id пользователя из базы данных посредством запроса
	let results=await global.pool.execute(query, [email]);
	
	//Получаем массив с данными (первый элемент массива - данные запроса второй элелмент массива
	//поля соответствующих объектов)
	let arrayOfChats=results[0];
	
	//Возвращаем массив чатов пользователя
	return arrayOfChats;
	
};


// Получение данных пользователя или получение пустого пользователя
chatModel.addChatToUser= async(email, nameOfChat)=>{


	//Вставляем чат пользователя
	let query = `

		INSERT INTO chats (name, idOfUser) 


		VALUES (?, (SELECT idOfUser FROM users WHERE Email = ?))

	`;

	//Отправляем запрос на вставку нового чата пользователя
	await global.pool.execute(query, [nameOfChat, email]);
	
	//Этот запрос отсортирует записи по величине id

	//в обратном порядке (последняя запись будет первой),

	//а затем ограничит вывод только одной записью с помощью `LIMIT 1`.

	let query = `
	
		SELECT idOfChat FROM chats 
		
		WHERE idOfUser=(SELECT idOfUser FROM users WHERE Email = ?)
		
		ORDER BY idOfChat DESC LIMIT 1 
		
	`;

	//Получаем ответ
	let results=await global.pool.execute(query, [email]);	
	
	//Получаем ответ из массива с данными
	let idOfChat=results[0][0];
	
	return idOfChat;
	

};

module.exports = chatModel;
