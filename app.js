
//Задаем общие настройки приложения и прописываем необходимые запросы к библиотекам
const express = require('express');
const expressWebSoket = require('express-ws')
const cors = require('cors');
const path = require('path');
const fs = require('fs');

//Подключаем пакет dotenv для чтения переменных из файла .env в Node
require('dotenv').config();

//Подключаем пакет mysql2 для доступа к базе данных
const mysql = require('mysql2/promise');
//Записываем в переменную объект с информацией для подкления к базе данных
let databaseConfig={
	
	host: process.env.dataBase_host,
	port: process.env.dataBase_port,
	user: process.env.dataBase_user,
	password: process.env.dataBase_password,
	database: process.env.dataBase_database,
	connectionLimit: process.env.dataBase_pullConnectionLimit// максимальное количество соединений в пуле
	
}

//Создаем pool соединений с базой данных
let pool = mysql.createPool(databaseConfig);

//Добавляем pool в глобальный объект
global.pool = pool;

//Создаем приложение express
const app=express();

//Позволяем приложению использовать обработку JSON данных
app.use(express.json());

//Добавляем возможность указать веб-сокет сервера для прослушивания
expressWebSoket(app);

//Подключаем модуль с определенными маршрутами - важно подключить маршруты после модуля с веб-сокет сервером
const routes = require('./routes/routes.js');

//Разрешаем CORS политику для запросов - можно обращаться к серверу с любого источника - сайта/мобильного приложения
app.use(cors());

//Используем объект router с определенными маршрутами в экземпляре приложения
app.use('/', routes);

//Прописываем доступ к статическим ресурсам на сервере - доступ к фронтенд файлам веб-приложения-------------------------

//Путь к папке с продуктовым приложением Vue
const pathToFrontendDirectory=path.resolve(__dirname,process.env.pathToFrontendDirectory);

//Для внутренних запросов между файлами (запросы от index.html к css, js и другим) в папке с приложением vue
app.use(express.static(pathToFrontendDirectory))

//Обработка оставшихся get запросов, которые не подошли не к одному верхнему каналу
app.get('*',(req, res)=>{
	
	res.sendFile(pathToFrontendDirectory+'/'+process.env.nameOfIndexFile);

});


//Указываем данные для подключения - порт и запускаем сервер
const server=app.listen(process.env.PORT,async function(){
	
	console.log(`server was started on port ${process.env.PORT}`);

});
