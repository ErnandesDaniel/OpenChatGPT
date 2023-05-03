
 export const axiosConfig = {
	 
	//baseURL: 'http://localhost:448/api/',  //Работа с PHP на локальном сервере для разрабтки

	baseURL:window.location.origin+'/api/',

	timeout: 1500,  
	headers:{'Content-Type': 'application/json; charset=utf-8'},
	
};
