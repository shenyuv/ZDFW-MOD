"use strict";

class Qutil_DLL{
	TableEdit(tables,obj,type){
		if(type == 'All'){
			tables = obj;
		}else if(this.isObject(tables)){
			let num = parseInt(type.substring(type.length - 1),10);
			if(type.indexOf('Edit')===0){
				this.getDataEdit(tables,obj,0,num);
			}else if(type.indexOf('Add')===0){
				this.getDataAdd(tables,obj,0,num);
			}else if(type.indexOf('Reset')===0){
				this.getDataReset(tables,obj,0,num);
			}else{
				tables = obj;//全部替换
			}
		}
	}
	/* 递归修改配置 */
	getDataEdit(a,b,c,d){
		let n = (c || 0) + 1;
		let m = (d || 99);
		for(let i in b){
			if(n<=m && this.isObject(b[i]) && this.isObject(a[i])){
				this.getDataEdit(a[i],b[i],n,m);
			}else{
				a[i] = b[i];
			}
		}
		return a;
	}
	
	/* 递归修改配置是数组则添加 */
	getDataAdd(a,b,c,d){
		let n = (c || 0) + 1;
		let m = (d || 0);
		for(let i in b){
			if(n>m && (b instanceof Array) && this.isObject(a) && (a instanceof Array)){
				a.push(b[i]);		
			}else if(typeof(b[i]) === 'object' && this.isObject(a[i])){
				if(this.isObject(b[i])){
					if(n>=m && (b[i] instanceof Array)){
						for(let j in b[i]){
							a[i].push(b[i][j]);
						}
					}else{
						this.getDataAdd(a[i],b[i],n,m);
					}
				}
			}else{
				a[i] = b[i];
			}
		}
		return a;
	}
	
	/* 递归到第3层并重设配置 */
	getDataReset(a,b,c,d){
		let n = (c || 0) + 1;
		let m = (d || 3);
		for(let i in b){
			if(this.isObject(b[i]) && this.isObject(a[i])){
				if(n>=m && (b[i] instanceof Array)){
					a[i] = b[i];
				}else{
					this.getDataReset(a[i],b[i],n,m);
				}
			}else{
				a[i] = b[i];
			}
		}
		return a;
	}
	
	/* 检查是否非空对象或数组 */
	isObject(e){
		if(e == null){
			return false;
		}else if(typeof(e)==='object' && (typeof(e.length)!=='number' || e.length > 0)){
			return true;
		}else{
			return false;
		}
	}
	
	/* 获取当前mod目录某个json数据 */
	getData(url){
		if(Qutil_VFS.exists(url)){
			try
			{
				return JSON.parse(Qutil_VFS.readFile(url));
			}
			catch (e)
			{
				let Pos = Number(e.message.split("position ").pop());
				if (Pos > 0)
				{
					Qutil_Logger.error(`JSON File Error: ${url} => Pos: ${Pos}`);
				}else{
					Qutil_Logger.error(e.message);
				}
			}
		}
		return new Object();
	}
}

module.exports = new Qutil_DLL;