
import localForage from 'localforage'
import { defineStore } from 'pinia'

export const useMainDataStore = defineStore('mainData',{
	
	state:()=>{
		
		return{

			//Устанавливаем дефолтные настройки приложения
			//userWasAuthorized:false,
			//Выбранный на странице авторизации блок для отображения - сохраняется в
			//постоянной памяти
			//authorizationSelectedBlock:'registration',

		}
		
	},



	
	actions:{



/*
		
		setStatusOfAuthorization(statusOfAuthorization){

			this.userWasAuthorized=statusOfAuthorization;

			//Обновляем объект общих настроек в локальной памяти приложения
			localStorage.setItem('statusOfAuthorization', statusOfAuthorization);
	
		},

		getStatusOfAuthorization(){

			//Получаем данные из локальной синхронной базы данных
			let userWasAuthorized=localStorage.getItem('statusOfAuthorization');


			if(userWasAuthorized==(null||'false')){

				this.userWasAuthorized=false;

			}else if(userWasAuthorized=='true'){

				this.userWasAuthorized=true;

			}

		},

		setAuthorizationSelectedBlock(authorizationSelectedBlock){

			this.authorizationSelectedBlock=authorizationSelectedBlock;

			//Обновляем объект общих настроек в локальной памяти приложения
			localStorage.setItem('authorizationSelectedBlock', authorizationSelectedBlock);
	
		},

		getAuthorizationSelectedBlock(){

			//Получаем данные из локальной синхронной базы данных
			let authorizationSelectedBlock=localStorage.getItem('authorizationSelectedBlock');
			
			if(authorizationSelectedBlock==null){

				this.authorizationSelectedBlock='registration';

			}

		},
		






*/



	},

})