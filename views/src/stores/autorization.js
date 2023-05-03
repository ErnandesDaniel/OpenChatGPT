
import { defineStore } from 'pinia'

export const useAutorizationStore = defineStore('autorization',{
	
	state:()=>{
		
		return{

			//Во время авторизации необходимо сохранить email и пароль в оперативной памяти
			email:'',

			password:'',

			authorizationToken:'',

			//Устанавливаем дефолтные настройки приложения
			statusOfAuthorization:false,
			//Выбранный на странице авторизации блок для отображения - сохраняется в
			//постоянной памяти
			authorizationSelectedBlock:'registration',

		}
		
	},
	
	actions:{

		downloadStatusOfAuthorization(){

			//Получаем данные из локальной синхронной базы данных
			this.statusOfAuthorization=JSON.parse(localStorage.getItem('statusOfAuthorization'));
	
		},

		downloadAuthorizationSelectedBlock(){
		
			this.authorizationSelectedBlock=JSON.parse(localStorage.getItem('authorizationSelectedBlock'));

		},

		downloadAuthorizationToken(){
		
			this.authorizationToken=JSON.parse(localStorage.getItem('authorizationToken'));

		},

		//Данные необходимые для подтверждения email пользователя - email,
		//password - используетя только для подтверждения регистрации пользователя
		setAutorizationData(email,password){

			this.email=email;

			this.password=password;

		},
		
		setStatusOfAuthorization(statusOfAuthorization){

			this.statusOfAuthorization=statusOfAuthorization;

			//Обновляем объект общих настроек в локальной памяти приложения
			localStorage.setItem('statusOfAuthorization', JSON.stringify(statusOfAuthorization));
	
		},

		setAuthorizationSelectedBlock(authorizationSelectedBlock){

			this.authorizationSelectedBlock=authorizationSelectedBlock;

			//Обновляем объект общих настроек в локальной памяти приложения
			localStorage.setItem('authorizationSelectedBlock', JSON.stringify(authorizationSelectedBlock));
	
		},

		setAuthorizationToken(authorizationToken){

			this.authorizationToken=authorizationToken;

			//Обновляем объект общих настроек в локальной памяти приложения
			localStorage.setItem('authorizationToken', JSON.stringify(authorizationToken));
	
		},

	},

})