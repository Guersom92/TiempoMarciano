//Declaración y asignación de variables
const key="OpPuUxDOwbZHZCnQnaYKJRRN4pTcI92ocf3I0jVF";
const soles=document.querySelector(".soles");
const sol_list=document.querySelectorAll(".sol");
const mediciones=document.querySelectorAll("section span");
const botónD=document.getElementById("right");
const botónI=document.getElementById("left");
const spanPc=document.getElementById("primerclon");
const span1=document.getElementById("día1");
const span2=document.getElementById("día2");
const span3=document.getElementById("día3");
const span4=document.getElementById("día4");
const span5=document.getElementById("día5");
const span6=document.getElementById("día6");
const span7=document.getElementById("día7");
const spanLc=document.getElementById("últimoclon");
let json;

async function petición(){
    const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`)
    json= await response.json();

    //Slider
    spanPc.innerText= json.sol_keys[6];
    span1.innerText= json.sol_keys[0];
    span2.innerText= json.sol_keys[1];
    span3.innerText= json.sol_keys[2];
    span4.innerText= json.sol_keys[3];
    span5.innerText= json.sol_keys[4];
    span6.innerText= json.sol_keys[5];
    span7.innerText= json.sol_keys[6];
    spanLc.innerText= json.sol_keys[0];

    medidas(json,0);
}

//Función para cambiar las mediciones
function medidas(objeto,sol){
    mediciones[0].innerText=ftoC(objeto[objeto.sol_keys[sol]].AT.mn);
    mediciones[1].innerText=ftoC(objeto[objeto.sol_keys[sol]].AT.av);
    mediciones[2].innerText=ftoC(objeto[objeto.sol_keys[sol]].AT.mx);
    mediciones[3].innerText=Math.round(objeto[objeto.sol_keys[sol]].PRE.mn);
    mediciones[4].innerText=Math.round(objeto[objeto.sol_keys[sol]].PRE.av);
    mediciones[5].innerText=Math.round(objeto[objeto.sol_keys[sol]].PRE.mx);
    mediciones[6].innerText=mtoK(objeto[objeto.sol_keys[sol]].HWS.mn.toFixed(2));
    mediciones[7].innerText=mtoK(objeto[objeto.sol_keys[sol]].HWS.av);
    mediciones[8].innerText=mtoK(objeto[objeto.sol_keys[sol]].HWS.mx); 

}

petición();
  
//Transformador de Fahrenheit a Celsius
function ftoC(medida){
    const resultado=(medida-32)*5/9
    return Math.round(resultado)
}

//Transformador de m/s a k/h
function mtoK(medida){
    const resultado=medida*3.6
    return Math.round(resultado)
}

// Counter
let contador=1;
let tamaño=sol_list[0].clientWidth; 
soles.style.transform=`translateX(${-tamaño*contador}px)`;

//Arreglando el problema del cambio de tamaño
var redimensionar;
window.addEventListener('resize',()=>{
    clearTimeout(redimensionar);
    redimensionar= setTimeout(redimensiónTerminada,200);
});
function redimensiónTerminada(){
    tamaño=sol_list[0].clientWidth;
    soles.style.transform=`translateX(${-tamaño*contador}px)`;
}

// Escuchadores de botones
botónD.addEventListener('click',()=>{
    if(contador>=8) return;
    tamaño=sol_list[0].clientWidth; 
    soles.style.transition= "transform 0.4s ease-in-out";
    contador++;
    soles.style.transform=`translateX(${-tamaño*contador}px)`;
    if(contador-1===-1)return;
    if(contador-1===7)return;
    medidas(json,contador-1);
})
botónI.addEventListener('click',()=>{
    if(contador<=0) return;
    tamaño=sol_list[0].clientWidth; 
    soles.style.transition= "transform 0.4s ease-in-out";
    contador--;
    soles.style.transform=`translateX(${-tamaño*contador}px)`;
    if(contador-1===-1)return;
    if(contador-1===7)return;
    medidas(json,contador-1);
    
})

soles.addEventListener('transitionend',()=>{
    if(contador===0){
        soles.style.transition='none';
        contador= 7;
        soles.style.transform=`translateX(${-tamaño*contador}px)`;
    }
    if(contador===8){
        soles.style.transition='none';
        contador= 1;
        soles.style.transform=`translateX(${-tamaño*contador}px)`;
    }
});