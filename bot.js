
var Bot = function(nombre, tipoRobot, xIndex, yIndex){
	this.nombre = nombre;
	this.sprite = new Image();
	this.xIndex=xIndex;
	this.yIndex=yIndex;
	this.accion= "";
	this.vivo=true;
	
	this.sprite.onload = function(){};
	this.sprite.src = "img/bots/r"+tipoRobot+".png";
	
	this.pintar= function(ctx, size){
		if(this.vivo){
			ctx.drawImage(this.sprite, 10+size*xIndex,10-size*0.65+size*yIndex,size,size*1.5);
		}
	};
	
	this.setX= function(i){
		xIndex = i;
	};
	this.getX= function(){
		return Math.round(xIndex);
	};
	this.setY= function(j){
		yIndex = j;
	};
	this.getY= function(){
		return Math.round(yIndex);
	};
	this.setVivo= function(vivo){
		this.vivo=vivo;
		this.accion="M";
	};
	this.isVivo= function(){
		return vivo;
	};
	this.getAccion = function(){
		switch(this.accion){
			case "N":
			return "\u2191";
			case "O":
			return "\u2192";
			case "S":
			return "\u2193";
			case "E":
			return "\u2190";
			case "P":
			return "pasa";
			case "I":
			return "Ini";
			default:
			return "M";
		}
		return "";
	};
	this.ejecutarAccion = function(accion){
		this.accion = accion[0];
		
		if(this.accion=='N'&&yIndex<=1){
			this.accion="";
		}
		else if(this.accion=='S'&&yIndex>=11){
			this.accion="";
		}
		else if(this.accion=='E'&&xIndex<=1){
			this.accion="";
		}
		else if(this.accion=='O'&&xIndex>=11){
			this.accion="";
		}
		this.vivo=true;
	};
	this.actualizarCoordenadas = function(i, j){
		xIndex= Math.round(xIndex);
		yIndex= Math.round(yIndex);
		
		if(xIndex>i){
			this.ejecutarAccion("E");
		}else if(xIndex<i){
			this.ejecutarAccion("O");
		}else if(yIndex>j){
			this.ejecutarAccion("N");
		
		}else if(yIndex<j){
			this.ejecutarAccion("S");
		}else{
			this.ejecutarAccion("P");
		}
	};
	
	this.mover = function(MOVF){
		if(this.vivo){
			switch(this.accion){
				case 'N':
					yIndex-=1/MOVF;
					if(yIndex%MOVF){
						accion="";
					}
				break;
				case 'O':
					xIndex+=1/MOVF;
					if(xIndex%MOVF){
						accion="";
					}
				break;
				case 'E':
					xIndex-=1/MOVF;
					if(xIndex%MOVF){
						accion="";
					}
				break;
				case 'S':
					yIndex+=1/MOVF;
					if(yIndex%MOVF){
						accion="";							
					}
				break;
				default:
				break;
			}
		}
	};
};
