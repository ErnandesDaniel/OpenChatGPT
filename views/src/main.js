import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import localForage from 'localforage'
import { createPinia } from 'pinia'
import './registerServiceWorker'
import './assets/reset.css'
import axios from 'axios'
import {axiosConfig} from './assets/axios.js'


/*
localForage.updateItem=function(key){

	//Проверяем создана ли локальная база данных
	this.getItem(key).then(function(value){

		console.log(value)

	});

};*/


const app=createApp(App);
app.use(router);
app.use(createPinia());
app.config.globalProperties.localForage=localForage;
app.config.globalProperties.axios= axios.create(axiosConfig);
app.mount('#app');

//Устаналвиваем используемый драйвер - IndexedDB
localForage.setDriver(localForage.INDEXEDDB);

















