"use strict";//严格js模式下必须定义变量
require("./Qutil_Class.js");//基础兼容类
global.Qutil_DLL = require("./Qutil_dll.js");//基础扩展类
class Qutil_main{
	/* 类入口方法 */
	ModLoader(){
		if(typeof(Qutil_Ver)==="string" && typeof(Qutil_Super)==="boolean" && typeof(Qutil_Helper)==="object" && Qutil_Super===true){//判断是否支持的版本
			this.Start();
		}
	}
	
	/* mod回调入口方法，配置文件加载完毕后开始执行 */
    Start(){
		let config1 = this.getData("src/default.json");
		let config2 = this.getData("db/config.json");
		const config = Qutil_DLL.getDataEdit(config1,config2);
		config.Online.IsEggs = (config.Locations.GameCatid>2 || config.Bots.BotsEggs==2) ? true : false;//是否开启彩蛋AI
		config.Online.IsTask = config.NewTrader.IsTask;//新商人销售预设武器
		config.Items.Other.LootNumber = config.Locations.LootNumber;//物资优化
		config.Items.Other.DurabilityBurnModificator = config.Globals.Durability;//武器耐久损耗
		config.Items.Other.Malfunction = config.Globals.Malfunction;//武器故障
		config.Items.Other.RagfairType = config.Ragfair.dynamic.type;//跳蚤市场类型
		
		for(let i in config){
			let file = '../extend/'+ i +'/'+ i +'.js';
			if(Qutil_VFS.exists(__dirname +'/'+ file)){
				let Qutil_extend = require(file);//加载扩展插件
				Qutil_extend.ModLoader(config[i]);//将自身配置信息传递过去
			}
		}
		
		// if(typeof(Qutil_Helper.handbook)==='function'){
			// Qutil_Helper.handbook();
		// }
		
		// if(typeof(Qutil_Helper.ragfair)==='function'){
			// Qutil_Helper.ragfair();
		// }
			
		let Airfile = __dirname +"/SuperMod-Distance.dll";
		let copyAirdir = process.cwd() +"/BepInEx/plugins/";
		if(Qutil_VFS.exists(Airfile) && Qutil_VFS.exists(copyAirdir + "aki-bundles.dll")){
			Qutil_VFS.copyFile(Airfile,copyAirdir +"SuperMod-Distance.dll");
		}
		
    }
	
	onCallback(url, info, sessionID, output){
		
		return Qutil_HttpResponse.noBody(null);
	}
	
	/* 根据路径结构重新重设配置 */
	getTables(tables,list,dir){
		for(let i in list){
			if(typeof(list[i])==="object"){
				this.getTables(tables[i],list[i], dir + i+"/");
			}else{
				let obj = this.getData(dir + i + ".json");
				if(list[i] == 'All'){
					tables[i] = obj;
				}else{
					Qutil_DLL.TableEdit(tables[i],obj,list[i]);
				}
			}
		}
	}
	
	/* 获取当前mod目录某个json数据 */
	getData(url){
		return Qutil_DLL.getData(__dirname +"/../"+ url);
	}
}

module.exports = new Qutil_main;