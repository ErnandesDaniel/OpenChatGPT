
//Подключаем модуль с функциями для работы с токенами
const authenticationTokens = require('../authenticationTokens.js');
const userModel=require('../models/user.js');
let authenticationController={};


//Получение токена аутентификации
authenticationController.getAuthenticationToken=async(req, res)=>{
	
	//Получаем email из запроса
	let email = req.body.email;
	
	//Изменяем все буквы в email на строчные
	email=email.toLowerCase();
	
	//Получаем password из запроса
	let password = req.body.password;
	
	//Проверка на то правильная ли пара email и password
	
	//Получаем данные пользователя по email
	let user= await userModel.getUserByEmail(email);
	
	//Если пользователь не найден, то отправляем сообщение об ошибке
	if(user==null){
		
		//Отправляем ответ пользователю о том, что email некорректный
		res.send({errorExist:true, actionMessage:'userNotFound'});
		
	}else{
		//Если пароль пользователя не совпадает с присланным паролем, то
		//отправляем сообщение об ошибке
		if(user.password!=password){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:'invalidPassword'});
		
		//Если пароль пользователя совпадает с присланным паролем, то высылаем токен авторизации
		}else if(user.password==password){
			
			//Создаем токен авторизации
			let token=authenticationTokens.getToken(email);
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:false, actionMessage:'tokenWasCreated', content:{token:token}});
			
		}
		
	}
	
};


//Экспортируем объект маршрутизации
module.exports=authenticationController;
