
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');
const userModel=require('../models/user.js');

//Создаем транспортер для посылки сообщений на почту
let transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPassword,
  },
});

//Функция отправки  сообщения на почту
let sendConfirmationCode=async(email, confirmationCode)=>{
	
	await transporter.sendMail({
		
		from: 'hste-media@yandex.ru',

		to: email,

		subject: 'Код подтверждения регистрации',

		text: String(confirmationCode),

		html:String(confirmationCode),

	});		
		
}

//Функция генерации кода подтверждения
createConfirmationCode=()=>{
	
	//Создаем код подтверждения	- целое число из 8 знаков
	let confirmationCode=String(Math.floor(Math.random()*10**8));
	
	return confirmationCode;
	
}

//Создаем объект контроллера регистрации
let registerController={};

//Запрос пользователя для получения кода подтверждения регистрации на почту
registerController.getRegistrationConfirmationCode=async(req, res)=>{
	
	//Получаем email из запроса
	let email = req.body.email;
	
	//Изменяем все буквы в email на строчные
	email=email.toLowerCase();
	
	//Проверяем корректность email:
	
	//Если email некорректный, то отправляем сообщение об ошибке
	if(emailValidator.validate(email)==false){
		
		//Отправляем ответ пользователю о том, что email некорректный
		res.send({errorExist:true, actionMessage:'invalidEmail'});
	
	//Иначе дальше продолжаем работу:
	}else{
		
		//Проверка нет ли в таблице пользователя с такой почтой
		let user= await userModel.getUserByEmail(email);
		
		
		//console.log(user);
		
		if(user==null){
			//Если результат равен null, то пользователь не найден, можно добавлять нового пользователя в базу данных:
				
			//Создаем код подтверждения	- целое число из 8 знаков
			let confirmationCode=createConfirmationCode();
			
			//Записываем пользователя и его код подтверждения в базу данных
			await userModel.create(email,confirmationCode);		
			console.log('Отправляем на почту код подтверждения регистрации нового пользователя');
			
			//После записи в базу данных отправляем код подтверждения на почту
			await sendConfirmationCode(email,confirmationCode);
			
			//Когда сообщение было отправлено на почту, то отправляем ответ пользователю
			res.send({errorExist:false, actionMessage:'checkEmail'});
			
		//Иначе, если пользователь найден, и его email не подтвержден
		}else if(user.emailHasBeenConfirmed==false){
					
			//Если в БД найдена запись с указанной почтой, но она еще не подтверждена, то записываем в БД новый код 
			//подтверждения и отправляем на эту почту код подтверждения
				
			//Создаем код подтверждения	- целое число из 8 знаков
			let confirmationCode=createConfirmationCode();
					
			//Записываем новый код подтверждения пользователя в базу данных
			await userModel.updateConfirmationCode(email, confirmationCode);	
			console.log('Отправляем на почту код подтверждения регистрации старого пользования');
			
			//После записи в базу данных отправляем код подтверждения на почту
			await sendConfirmationCode(email,confirmationCode);

			//Когда сообщение было отправлено на почту, то отправляем ответ пользователю
			res.send({errorExist:false, actionMessage:'checkEmail'});
		
		//Если пользователь уже был зарегистрирован и его email подтвержден, то высылем ошибку
		}else if(user.emailHasBeenConfirmed==true){
			//Если пользователь с указанной почтой найден и почта подтверждена, то
			//отправляем сообщение об ошибке, что пользователь уже зарегистрирован
				
			//Отправляем ответ пользователю
			res.send({errorExist:true, actionMessage:'userHasBeenAlreadyRegistered'});	
				
		}		
		
	}
	
};



registerController.sendRegistrationConfirmationCode=async(req, res)=>{

	//Получаем данные пользователя о почте, пароле и о коде подтверждения
	
	//Получаем email из запроса
	let email = req.body.email;
	
	//Изменяем все буквы в email на строчные
	//email=email.toLowerCase();
	
	// Получаем password
	let password = req.body.password;
	
	//Получаем код подтверждения из запроса
	let confirmationCode=req.body.confirmationCode;
	
	console.log(req.body);
	
	//Проверка есть ли в таблице пользователь с такой почтой
	let user= await userModel.getUserByEmail(email);
	
	//Если пользователь найден
	if(user!=null){
		
		//Если пользователь еще не подтвердил свою почту и код подтверждения,
		//присланнный пользователем, равен коду подтверждения в базе данных
		//то подтверждаем email пользователя
		if(user.emailHasBeenConfirmed==false && user.confirmationCode==confirmationCode){
			
			//Подтверждаем пользователя - устанавливаем его пароль и статус учетной записи
			await userModel.confirmEmailOfUser(email,password);
			
			//Отправляем ответ пользователю
			res.send({errorExist:false, actionMessage:'emailHasBeenConfirmed'});
			
			
			console.log('emailHasBeenConfirmed');
			
			
			
		}else{
		
			//Отправляем ответ об ошибке пользователю
			res.send({errorExist:true, actionMessage:'invalidConfirmationCode'});

			console.log('invalidConfirmationCode');			
			
		}
		
	}
	
}



/*


router.post('/api/sendRegistrationConfirmationCode',(req, res)=>{
	
	//Получаем данные пользователя о почте и о коде подтверждения
	
	//Создаем объект соединения с базой данных
	let connection = mysql.createConnection(databaseConfig);
	
	//В начале запроса устанавливаем соединение с базой данных
	connection.connect();
	
	//Получаем email из запроса
	let email = req.body.email;
	
	//Изменяем все буквы в email на строчные
	email=email.toLowerCase();
	
	// Получаем password
	let password = req.body.password;
	
	//Получаем код подтверждения из запроса
	let confirmationCode=req.body.confirmationCode;
	
	//Создаем запрос на получение данных о пользователе
	let query = `SELECT * FROM users WHERE Email=?`;
	
	connection.query(query, [email],(err, results)=>{
		
		//Если в БД не найдено записи votedID с данной почтой, то это значит, что
		//не был прислан еще код подтверждения голосования
		 if(results[0].emailHasBeenConfirmed==false){
			 
			if(results[0].confirmationCode==confirmationCode){
				
				query = `UPDATE users SET emailHasBeenConfirmed = ? WHERE Email = ?`;
					 
				connection.query(query, [true,email],(err,results)=>{
					//После записи в базу данных отправляем код подтверждения на почту
					
					//Отправляем ответ пользователю
					res.send({errorExist:false, actionMessage:'emailHasBeenConfirmed'});
					
					//В конце запроса разрываем соединение с базой данных
					connection.end();
							
				});	
				
			}else{
				
				//Отправляем ответ об ошибке пользователю
				res.send({errorExist:true, actionMessage:'invalidConfirmationCode'});
				
				//В конце запроса разрываем соединение с базой данных
				connection.end();
				
			}
			
		 }else{
			 
				res.send({errorExist:true, actionMessage:'emailHasAlreadyBeenConfirmed'});
			 
			 	//В конце запроса разрываем соединение с базой данных
				connection.end();
			 
		 }
		 
	})
	
});



*/




//Экспортируем контроллер
module.exports=registerController;