const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
	
	transpileDependencies: true,
  
	pwa: {
		
		name: 'ChatGPT Open',
		
		themeColor: 'white',
		
		msTileColor: 'white',

		//настройки манифеста
		manifestOptions:{
			
			background_color: 'white',
			
			//другие настройки манифеста
			
		},
		
	},
	
	
	devServer: {
		
		proxy: 'http://localhost:448'
	
	},
  
})
