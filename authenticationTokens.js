

const jwt = require('jsonwebtoken');

//Параметры шифрования
let signOptions = {
	
	algorithm:  "HS256",//Указываем алгоритм шифрования
 
};

//Создаем функцию для создания токена аутентификации
let getToken=(email)=>{
	

	
	let issuedAt = Date.now();//Время создания объекта чата в эпохе Unix
	
	let payload = {email:email, iat:issuedAt};//Создаем нагрузку с email пользователя и временем создания токена
	
	let token = jwt.sign(payload, process.env.secretAuthorizationTokenKey, signOptions);
	
	return token;
		
}


//Создаем функцию для проверки токена аутентификации
let checkToken=(token)=>{
	
	let tokenIsValid=false;
	
	if(token!=null){
		
		try {
		
		  let decodedToken = jwt.verify(token, process.env.secretAuthorizationTokenKey, signOptions);
		  
		  //если декодирование токена удастся, то токен действителен
			tokenIsValid=true;
		  
		}catch(err){
			//Если произошла ошибка при декодировании токена:
			
			//Если декодирование токена не удастся, то токен недействителен
			tokenIsValid=false;
			
		}
	
	}

	return tokenIsValid;
	
}


let getDecodedToken=(token)=>{
	
	//Декодируем токен
	return jwt.decode(token, signOptions);
		
}


//Экспортируем объект с функциями для работы с токенами
module.exports={
	
	getToken,
	
	checkToken,
	
	getDecodedToken,
	
};