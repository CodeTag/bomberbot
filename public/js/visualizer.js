var tipos= ['c','d','r','t'];
var colores= ['a','b','f','m','n','r','v'];
var ctx=undefined;
var size=45;
var MOVF=30;
var turno=0;
var sizeBomb=50;

var xBombAnimationFrame=0;
var contAnimation=0;
var bombAnimation = [0,1,2,1];

var tempVelocidad=MOVF;
var cambiarVelocidad= function(velocidad){
    tempVelocidad = velocidad;
}

var crearRandomRobot = function(){
    var tipoSel = Math.round(Math.random()*(tipos.length-1));
    var colorSel = Math.round(Math.random()*(colores.length-1));
    return tipos[tipoSel]+""+colores[colorSel];
};


//var mapaSource="XXXXXXXXXXX\nXA_BX\nX___X\nXLLLX\nX_3_X\nXC_DX\nXXXXX-XXXXX\nXA__X\nX__BX\nXLLLX\nX_2DX\nXC__X\nXXXXX-XXXXX\nX3_BX\nXA__X\nXLLLX\nX_1_X\nXC_DX\nXXXXX-XXXXX\nX2B_X\nXA__X\nXL#LX\nX###X\nXC#DX\nXXXXX-XXXXX\nX1B_X\nX_A_X\nXL_LX\nX___X\nX_CDX\nXXXXX-XXXXX\nX##BX\nX#A_X\nXL_LX\nX__DX\nXC__X\nXXXXX-XXXXX\nX__BX\nXA__X\nXL_LX\nX_D3X\nX3C_X\nXXXXX-XXXXX\nX__BX\nXA__X\nXL_LX\nX_D2X\nX2_CX\nXXXXX-XXXXX\nX__BX\nXA__X\nXLDLX\nX__1X\nX1_CX\nXXXXX-XXXXX\nX__BX\nXAD_X\nXL_#X\nX###X\nX###X\nXXXXX-XXXXXXXXXXX\nX__BX\nXAD_X\nXL__X\nX___X\nX___X\nXXXXX\nXXXXX\nXXXXX\nXXXXX\nXXXXXXXXXXX";
var $a = $("#mapa");
var mapaSource=$a.data("gio");
mapaSource=mapaSource.replace(/,/g,"");

console.log("mapa "+mapaSource)
var ancho=0;
var alto=0;
window.onload= function(){
    var tablero = document.getElementById("tablero");
    var mapa =  "";
    
    var mapaHistory =  mapaSource.split("-");
    
    if(tablero.getContext) {
        ctx = tablero.getContext('2d');
        ctx.font = '13px Calibri';
        var bloque = new Image();
        bloque.src = "img/SolidoBloque50.png";
        var ladrillo = new Image();
        ladrillo.src = "img/LadrilloBloque50.png";
        var bomba = new Image();
        bomba.src = "img/spritebomb.png";

        var fuego = new Image();
        fuego.src = "img/spritefuego.png";
        var poderbomba = new Image();
        poderbomba.src = "img/PoderBomba.png";
        var poderpow = new Image();
        poderpow.src = "img/PoderFlama.png";
        
        var bot1 = new Bot($("#jugadorA").data("jugadora"),crearRandomRobot(),-1,-1);
        var bot2 = new Bot($("#jugadorB").data("jugadorb"),crearRandomRobot(),-1,-1);
        var bot3 = new Bot($("#jugadorC").data("jugadorc"),crearRandomRobot(),-1,-1);
        var bot4 = new Bot($("#jugadorD").data("jugadord"),crearRandomRobot(),-1,-1);
    }
    
    var fondo = function(){
        var i=0;
        var j=0;
        var cont=0;
        ctx.beginPath();
        ctx.fillStyle="#000";
        ctx.rect(0, 0, 520, 700);
        ctx.fill();
        while(cont<mapa.length){
            switch(mapa[cont]){
                case 'X':
                    ctx.drawImage(bloque, 10+i*size,10+j*size,size,size);
                    i++;
                break;
                case 'L':
                    ctx.drawImage(ladrillo, 10+i*size,10+j*size,size,size);
                    i++;
                break;
                case '4': case '3':case '2':case '1':
                    ctx.drawImage(bomba, sizeBomb*bombAnimation[xBombAnimationFrame], 0,sizeBomb, sizeBomb, 10+i*size,10+j*size,size,size);
                    i++;
                break;
                case '#':
                    ctx.drawImage(fuego, sizeBomb*0,0,sizeBomb, sizeBomb,10+i*size, 10+j*size,size,size);
                    i++;
                break;
                case 'V':
                    ctx.drawImage(poderbomba, sizeBomb*0,0,sizeBomb, sizeBomb,10+i*size, 10+j*size,size,size);
                    i++;
                break;
                case 'P':
                    ctx.drawImage(poderpow, sizeBomb*0,0,sizeBomb, sizeBomb,10+i*size, 10+j*size,size,size);
                    i++;
                break;
                case 'A':case 'B':case 'C':case 'D':case 'a':case 'b':case 'c':case 'd':
                case '_':
                    i++;
                break;
                case '\n':
                    j++;
                    i=0;
                break;
            }
            cont++;
        }
        
        ctx.stroke();
    };
    var pintarStatus = function(){
        ctx.beginPath();
        ctx.fillStyle="#000";
        ctx.rect(520, 0, 230, 700);
        ctx.fill();
        ctx.fillStyle="#FFF";
        ctx.fillText("Turno "+turno,570,50);
        
        
        ctx.drawImage(bot1.sprite,0,0,50,75,520,70,20,30);
        ctx.fillText(bot1.nombre,560,85);
        ctx.fillText(bot1.getAccion(),680,85);
        
        ctx.drawImage(bot2.sprite,0,0,50,75,520,120,20,30);
        ctx.fillText(bot2.nombre,560,135);
        ctx.fillText(bot2.getAccion(),680,135);
        
        ctx.drawImage(bot3.sprite,0,0,50,75,520,170,20,30);
        ctx.fillText(bot3.nombre,560,185);
        ctx.fillText(bot3.getAccion(),680,185);
        
        ctx.drawImage(bot4.sprite,0,0,50,75,520,220,20,30);
        ctx.fillText(bot4.nombre,560,220);
        ctx.fillText(bot4.getAccion(),680,235); 
        ctx.stroke();
    }
    
    var pintar = function(){
        ctx.beginPath();
        for(var i=0; i<alto;i++){
            if(bot1.getY()==i){
                bot1.pintar(ctx, size);                     
            }
            if(bot2.getY()==i){                     
                bot2.pintar(ctx, size);
            }
            if(bot3.getY()==i){
                bot3.pintar(ctx, size);                     
            }
            if(bot4.getY()==i){
                bot4.pintar(ctx, size);                     
            }
        }
        ctx.stroke();
    };
    
    
    var factorMovbots=1/MOVF;
    
    var cont=0;
    var moverBots= function(){
        
        bot1.mover(MOVF);
        bot2.mover(MOVF);
        bot3.mover(MOVF);
        bot4.mover(MOVF);
        fondo();
        pintar();
        cont++;
        
    };
    
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    
    var leerMapa= function(){
        var i=0;
        var j=0;
        var cont=0;
        mapa= mapaHistory[turno];
        if(turno==0){
            while(cont<mapa.length){
                switch(mapa[cont]){
                    case '\n':
                        j++;
                        i=0;
                    break;
                    case 'A':
                        bot1.setX(i);
                        bot1.setY(j);
                        i++;
                    break;
                    case 'B':
                        bot2.setX(i);
                        bot2.setY(j);
                        i++;
                    break;
                    case 'C':
                        bot3.setX(i);
                        bot3.setY(j);
                        i++;
                    break;
                    case 'D':
                        bot4.setX(i);
                        bot4.setY(j);
                        i++;
                    break;
                    default:
                        i++;
                        break;
                }
                cont++;
            }
            ancho=i;
            alto=j+1;
            console.log("ancho "+ancho);
            console.log("alto "+alto);
            bot1.ejecutarAccion("I");
            bot2.ejecutarAccion("I");
            bot3.ejecutarAccion("I");
            bot4.ejecutarAccion("I");
            
        }else{
            bot1.setVivo(false);
            bot2.setVivo(false);
            bot3.setVivo(false);
            bot4.setVivo(false);
        }
        
        while(cont<mapa.length){
            switch(mapa[cont]){
                
                case '\n':
                    j++;
                    i=0;
                break;
                case 'A':case 'a':
                    bot1.actualizarCoordenadas(i,j);
                    i++;
                break;
                case 'B':case 'b':
                    bot2.actualizarCoordenadas(i,j);
                    i++;
                    break;
                case 'C':case 'c':
                    bot3.actualizarCoordenadas(i,j);
                    i++;
                    break;
                case 'D':case 'd':
                    bot4.actualizarCoordenadas(i,j);
                    i++;
                    break;
                default:
                    i++;
                break;
            }
            cont++;
        }
        
    };
        
    
    var fin=false;
    (function animloop(){
        if(!fin){
            requestAnimFrame(animloop);
            contAnimation++;
            if(contAnimation%10==0){
                contAnimation=0;
                xBombAnimationFrame++;
                if(xBombAnimationFrame>=bombAnimation.length){
                    xBombAnimationFrame=0;
                }
            }
        }
        if(cont%MOVF==0){
            if(turno==mapaHistory.length){
                fin=true;
            }else{
                leerMapa();
                MOVF=tempVelocidad;
                pintarStatus();
                turno++;
            }
        }
        moverBots();    
        
    })();
    
};