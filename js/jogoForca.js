/* Variaveis*/

var txt;
var canvas;
var colorMargem = "YELLOW";
var iniX = 200;
var iniY = 300;
var letras = "QWERTYUIOPASDFGHJKLÇZXCVBNM";
var palavra;
var distanciaLetras = 35;
var margemLetras = 20;
var dicaTxt = "";
var colorTecla = "#020233";


/* Arrays*/

var array_letras = new Array();
var array_palavras = new Array();
var array_teclas = new Array();


var erros = 0;
var acertos = 0;


/* Palavras para sorteio */

array_palavras.push("DESENVOLVEDOR");
array_palavras.push("JAVASCRIPT");
array_palavras.push("TECLADO");
array_palavras.push("CONTROLE");
array_palavras.push("ALURA");
array_palavras.push("PROGRAMADOR");
array_palavras.push("ORACLE");
array_palavras.push("PLATAFORMA");
array_palavras.push("CANVAS");
array_palavras.push("TERMINAL");
array_palavras.push("COMPARTILHAR");
array_palavras.push("CODIGO");
array_palavras.push("NOITE");
array_palavras.push("TARDE");
array_palavras.push("MATERIAL");
array_palavras.push("CASA");
array_palavras.push("ESTUDO");
array_palavras.push("FORMULARIO");
array_palavras.push("RESPONSIVO");
array_palavras.push("NAVIO");
        

function Tecla(x, y, largura, alt, letra){
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.alt = alt;
    this.letra = letra;
    this.desenha = desenhaTecla;
}


/* função que Desenha a forca mais os espaços */
 
function Letra(x, y, largura, alt, letra){
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.alt = alt;
    this.letra = letra;
    this.desenha = desenhaCampoLetra;
    this.desenhaLetra = desenhaLetraLetra;
}


function desenhaTecla(){
    txt.fillStyle = colorTecla;
    txt.strokeStyle = colorMargem;
    txt.fillRect(this.x, this.y, this.largura, this.alt);
    txt.strokeRect(this.x, this.y, this.largura, this.alt);
    
    txt.fillStyle = "white";
    txt.font = "bold 20px courier";
    txt.fillText(this.letra, this.x+this.largura/2-5, this.y+this.alt/2+5);
}


/* função que desenha a letra dentro do espaço */

function desenhaLetraLetra(){
    var w = this.largura;
    var h = this.alt;
    txt.fillStyle = "black";
    txt.font = "bold 40px Courier";
    txt.fillText(this.letra, this.x+w/2-12, this.y+h/2+14);
}
function desenhaCampoLetra(){
    txt.fillStyle = "white";
    txt.strokeStyle = "black";
    txt.fillRect(this.x, this.y, this.largura, this.alt);
    txt.strokeRect(this.x, this.y, this.largura, this.alt);
}


/* função onde o teclado de letras vai aparecer */

function teclado(){
    var ren = 0;
    var col = 0;
    var letra = "";
    var novaLetra;
    var x = iniX;
    var y = iniY;
    for(var i = 0; i < letras.length; i++){
        letra = letras.substr(i,1);
        novaLetra = new Tecla(x, y, distanciaLetras, distanciaLetras, letra);
        novaLetra.desenha();
        array_teclas.push(novaLetra);
        x += distanciaLetras + margemLetras;
        col++;
        if(col==10){
            col = 0;
            ren++;
            if(ren==2){
                x = 280;
            } else {
                x = iniX;
            }
        }
        y = iniY + ren * 50;
    }
}


/* função desenha a palavra sorteada ao ponto que seleciona a letra no teclado */

function desenhaPalavra(){
    var p = Math.floor(Math.random()*array_palavras.length);
    palavra = array_palavras[p];
    
    var w = canvas.width;
    var len = palavra.length;
    var ren = 0;
    var col = 0;
    var y = 230;
    var tam_espaco = 45;
    var x = (w - (tam_espaco+margemLetras) *len)/2;
    for(var i=0; i<palavra.length; i++){
        letra = palavra.substr(i,1);
        novaLetra = new Letra(x, y, tam_espaco, tam_espaco, letra);
        novaLetra.desenha();
        array_letras.push(novaLetra);
        x += tam_espaco + margemLetras;
    }
}

/* função desenha a forca apos os erros*/

function forca(erros){
    var imagem = new Image();
    imagem.src = "./img/forca"+erros+".png";
    imagem.onload = function(){
        txt.drawImage(imagem, 390, 0, 230, 230);
    }
    
}


/* ajustar coordenadas*/
function ajusta(xx, yy){
    var proxCanvas = canvas.getBoundingClientRect();
    var x = xx-proxCanvas.left;
    var y = yy-proxCanvas.top;
    return{x:x, y:y}
}

/* função de analise da letra selecionada com a palavra sorteada */  

function seleciona(e){
    var prox = ajusta(e.clientX, e.clientY);
    var x = prox.x;
    var y = prox.y;
    var tecla;
    var campo_esp = false;
    for (var i = 0; i < array_teclas.length; i++){
        tecla = array_teclas[i];
        if (tecla.x > 0){
            if ((x > tecla.x) && (x < tecla.x + tecla.largura) && (y > tecla.y) && (y < tecla.y + tecla.alt)){
                break;
            }
        }
    }
    if (i < array_teclas.length){
        for (var i = 0 ; i < palavra.length ; i++){ 
            letra = palavra.substr(i, 1);
            if (letra == tecla.letra){ 
                campo = array_letras[i];
                campo.desenhaLetra();
                acertos++;
                campo_esp = true;
            }
        }
        if (campo_esp == false){ 
            erros++;
            forca(erros);
            if (erros == 6) gameOver(erros);
        }
        
        txt.clearRect(tecla.x - 1, tecla.y - 1, tecla.largura + 2, tecla.alt + 2);
        tecla.x - 1;
        
        if (acertos == palavra.length) gameOver(erros);
    }
}


/* função gamer over para carregar um novo jogo */

function gameOver(erros){
    txt.clearRect(0, 0, canvas.width, canvas.height);
    txt.fillStyle = "black";

    txt.font = "bold 40px sans-serif";
    if (erros < 6){
        txt.fillText("Parabens você acertou a palavra é: ", 110, 280);
    } else {
        txt.fillText("Você errou, a palavra era: ", 110, 280);
    }
    
    txt.font = "bold 30px sans-serif";
    distanciaLetras = (canvas.width - (palavra.length*30))/2;
    txt.fillText(palavra, distanciaLetras, 380);
    forca(erros);
}


/* função do canvas, funções carregadas para iniciar o jogo */

window.onload = function(){
    canvas = document.getElementById("tela");
    if (canvas && canvas.getContext){
        txt = canvas.getContext("2d");
        if(txt){
            teclado();
            desenhaPalavra();
            forca(erros);
            canvas.addEventListener("click", seleciona, false);
        } else {
            alert ("Erro ao carregar dados!");
        }
    }
}