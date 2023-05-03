
const express = require('express');
const router = express.Router();

//Подключаем модуль с маршрутами для регистрации
const registerController = require('../controllers/registerController.js');

router.post(

	'/api/getRegistrationConfirmationCode',

	registerController.getRegistrationConfirmationCode

);

router.post(

	'/api/sendRegistrationConfirmationCode', 

	registerController.sendRegistrationConfirmationCode

);


//Подключаем модуль с маршрутами для авторизации
const authenticationController = require('../controllers/authenticationController.js');

router.post(

	'/api/getAuthenticationToken', 

	authenticationController.getAuthenticationToken

);



//Подключаем модуль с маршрутами для соединения с нейросетью (скоро необходимо удалить)
const connection = require('../controllers/connection.js');
router.use('/', connection);


//Подключаем модуль с маршрутами для веб-сокет подключений
const webSocketController = require('../controllers/webSocketController.js');

router.ws(

	'/',

	webSocketController.connection

);




//Экспортируем объект маршрутизации
module.exports=router;