const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const router = express.Router();
//Подключаем пакет dotenv для чтения переменных из файла .env в Node
require('dotenv').config();


//Указываем API-ключ для доступа к chatGPT
const OpenAI_API_key=process.env.OpenAI_API_key;

//Создаем объект конфигурации
const configuration = new Configuration({
	apiKey: OpenAI_API_key,
});

//Создаем объект для совершения запросов к chatGPT
const openai = new OpenAIApi(configuration);

//Получить ответ от chatGPT в виде чата
router.post('/api/getStreamResponse', async(req, res)=>{
	
	//Получаем прошлые сообщения чата пользователя
	let listOfMessages=req.body.listOfMessages;
	
	//Добавляем системное указание роботу в начало массива
	listOfMessages.unshift({role: "system", content: "You are a helpful assistant."});
	
	
	try {
		
		//Получаем объект ответа от сервера OpenAI
		let response = await openai.createChatCompletion({
			
			model: "gpt-3.5-turbo",

			messages: listOfMessages,

			temperature: 0,//Вывод детерминированный 0 - детерминированный (
			//стабильный, наиболее вероятный вывод - фактический вывод), 2 - случайный

			max_tokens: 1000,//Длина рассказа - максимальное количество токенов
			
			stream:true,
			
		}, { responseType: 'stream' });
		
		//Реагируем на событие  обновления data сервера OpenAI
		response.data.on('data',(data)=>{
			
			//Преобразуем полученные данные в строку (одна длинная строка со знаками переноса)
			let lines = data.toString();
			
			//Преобразуем полученные данные в массив строк с разделителем в виде знака переноса строки
			let linesArray=lines.split("\n");
			
			//Получаем сообщение, убрав из массива пустые строки через фильтрацию массива, и получив его единственный элемент
			let message=linesArray.filter((line) => line.trim() !== "")[0];
			
			//Ищем строки, которые начинаются с "data: ". 
			//Символ "^" в начале означает начало строки, 
			//а "data: " - это просто текст, который мы ищем.
			//Убираем в начале строки выражение "data:"
			message=message.replace(/^data: /, "");
			
			//Не всегда появляется [DONE]
			if(message === '[DONE]'){
				
				console.log('Конец сообщения');
				//Отправляем сообщение о конце потока
				res.end();
				
			}else{
			
			
				//Преобразуем message из JSON формата в объект JavaScript
				message=JSON.parse(message);
				
				//Получаем объект с необходимыми данными для ответа
				message=message.choices[0];
				
				//Если контент не равен нулю
				if(message.delta.content!=null){
					
					//То присылаем пользователю сообщение
					console.log(message.delta);
					
					res.write(message.delta.content);
					
					//Если контент равен нулю и указан конец сообщения или достигнута максимальная длина сообщения
					//то завершаем связь с пользователем
				}else if(message.finish_reason=='stop'|| message.finish_reason=='length'){
					
					res.end();
					console.log('Конец сообщения');
					
				}
			
			}	
			
		});
		
	}catch(error){
	
		res.write('Произошла ошибка во время запроса к OpenAI. Попробуйте повторить запрос');

		res.end();

	}

});


//Экспортируем объект маршрутизации
module.exports=router;