
//Создаем объект (модель) для работы с данными пользователя
const userModel = {};

// Получение данных пользователя или получение пустого пользователя
userModel.getUserByEmail= async(email)=>{

	//Создаем строку запроса к базе данных
	let query = `SELECT * FROM users WHERE Email=?`;

	//Получаем данные из базы данных посредством запроса
	let results=await global.pool.execute(query, [email]);
	
	//Получаем строку с данными
	let arrayOfData=results[0];
	
	//Если в полученных данных
	if(arrayOfData.length==0){
		
		return null
		
	}else{
		
		//Получаем объект с информацией - первый (и последний, если нет ошибок) в массиве
		rowOfData=arrayOfData[0];
		
		//Преобразуем представление MySQL для типа boolean
		//в более удобные значения
		if(rowOfData.emailHasBeenConfirmed==0){
			
			rowOfData.emailHasBeenConfirmed=false;
			
		}else if(rowOfData.emailHasBeenConfirmed==1){
			
			rowOfData.emailHasBeenConfirmed=true;
			
		}
		
		return rowOfData;
		
	}

};


//Создание нового пользователя
userModel.create= async(email,confirmationCode)=>{
	
	let query = `INSERT INTO users(Email, emailHasBeenConfirmed, confirmationCode) VALUES (?, ?, ?)`;

	//Получаем данные из базы данных посредством запроса
	await global.pool.execute(query, [email, false, confirmationCode]);

};


//Обвноление кода подтверждения пользователя
userModel.updateConfirmationCode= async(email,confirmationCode)=>{
	
	//Создаем строку запроса к базе данных
	let query = `UPDATE users SET confirmationCode = ? WHERE Email = ?`;
	
	//Обновляем код подтверждения пользователя
	await pool.execute(query, [confirmationCode,email]);

};


//Обвноление кода подтверждения пользователя
userModel.confirmEmailOfUser= async(email, password)=>{
	
	//Создаем строку запроса к базе данных
	let query = `UPDATE users SET password = ?, emailHasBeenConfirmed = ? WHERE Email = ?`;
	
	//Обновляем состояние регистрации пользователя - пользователь полноценно
	//зарегистрирован
	await pool.execute(query, [password, true, email]);

};


module.exports = userModel;






















