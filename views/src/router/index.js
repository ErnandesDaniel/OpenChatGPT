import { createRouter, createWebHistory } from 'vue-router'
import listOfChats from '@/pages/listOfChats.vue'
import chat from '@/pages/chat.vue'
import profile from '@/pages/profile.vue'
import autorization from '@/pages/autorization.vue'
import confirmationRegistration from '@/pages/confirmationRegistration.vue'

import { useAutorizationStore } from '@/stores/autorization.js'

const routes = [

  {
    path: '/autorization',
    name: 'autorization',
    component: autorization
  },

  {
    path: '/confirmationRegistration',
    name: 'confirmationRegistration',
    component: confirmationRegistration
  },

  {
    path: '/',
    name: 'listOfChats',
    component: listOfChats
  },

  {
    path: '/chat/:id',
    name: 'chat',
    component: chat
  },

  {
    path: '/profile',
    name: 'profile',
    component: profile
  },

  /*{

    path: '/:pathMatch(.*)*',
    name: 'not-found',
    alias: '/404',
    component: listOfChats
  },*/

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next)=>{

  //Получаем объект с данными об авторизации
  let  autorization=useAutorizationStore();

  if(autorization.statusOfAuthorization==true){

    //Если пользователь пытается зайти на страницу авторизации из какой-то страницы,
    //когда он авторизован, то его выкидывает на страницу чата

    if(to.name=='autorization'){

      next({name:'listOfChats', replace:true});

    }else{

      next();

    }

  }else

  if(autorization.statusOfAuthorization==false){

    //Если пользователь пытается зайти на любую страницу, кроме авторизации, 
    //когда он неавтозирован, то его всегда выбрасывает на страницу авторизации
    //Настриваем переход со страницы авторизации на страницу ввода 
    //кода подтверждения регистрации
    if(from.name=='autorization' && to.name=='confirmationRegistration'){

      next();

    //Настраиваем переход со страницы ввода кода подтверждения регистрации на страницу
    //авторизации
    }else if(from.name=='confirmationRegistration' && to.name=='autorization'){

      next();

    }else if(to.name!='autorization'){

      next({name:'autorization', replace:true});

    }else if(to.name=='autorization'){

      next();
    }

  }

});

export default router
