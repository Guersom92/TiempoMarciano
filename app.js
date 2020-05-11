//Declaración y asignación de variables
const key="OpPuUxDOwbZHZCnQnaYKJRRN4pTcI92ocf3I0jVF";
const soles=document.querySelector(".soles");
const sol_width=document.querySelector(".sol");
const mediciones=document.querySelectorAll("section span");
const botónD=document.getElementById("right");
const botónI=document.getElementById("left");
const span_sol= document.querySelectorAll(".sol span:nth-child(2)");
const span_día= document.querySelectorAll(".sol span:nth-child(3)");

let json;

async function petición(){
    const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`)
    json= await response.json();

    //Slider
    span_sol[0].innerText= json.sol_keys[6];
    span_día[0].innerText= fecha(new Date(json[json.sol_keys[6]].First_UTC));
    span_sol[1].innerText= json.sol_keys[0];
    span_día[1].innerText= fecha(new Date(json[json.sol_keys[0]].First_UTC));
    span_sol[2].innerText= json.sol_keys[1];
    span_día[2].innerText= fecha(new Date(json[json.sol_keys[1]].First_UTC));
    span_sol[3].innerText= json.sol_keys[2];
    span_día[3].innerText= fecha(new Date(json[json.sol_keys[2]].First_UTC));
    span_sol[4].innerText= json.sol_keys[3];
    span_día[4].innerText= fecha(new Date(json[json.sol_keys[3]].First_UTC));
    span_sol[5].innerText= json.sol_keys[4];
    span_día[5].innerText= fecha(new Date(json[json.sol_keys[4]].First_UTC));
    span_sol[6].innerText= json.sol_keys[5];
    span_día[6].innerText= fecha(new Date(json[json.sol_keys[5]].First_UTC));
    span_sol[7].innerText= json.sol_keys[6];
    span_día[7].innerText= fecha(new Date(json[json.sol_keys[6]].First_UTC));
    span_sol[8].innerText= json.sol_keys[0];
    span_día[8].innerText= fecha(new Date(json[json.sol_keys[0]].First_UTC));


    medidas(json,0);
}
//Función de fecha
function fecha(fecha){
    return fecha.toLocaleDateString(
        undefined,{
            day:"numeric", month: "long"
        }
    )

}

//Función para cambiar las mediciones
function medidas(objeto,sol){
    mediciones[0].innerText=Math.round(objeto[objeto.sol_keys[sol]].AT.mn);
    mediciones[1].innerText=Math.round(objeto[objeto.sol_keys[sol]].AT.av);
    mediciones[2].innerText=Math.round(objeto[objeto.sol_keys[sol]].AT.mx);
    mediciones[3].innerText=Math.round(objeto[objeto.sol_keys[sol]].PRE.mn);
    mediciones[4].innerText=Math.round(objeto[objeto.sol_keys[sol]].PRE.av);
    mediciones[5].innerText=Math.round(objeto[objeto.sol_keys[sol]].PRE.mx);
    mediciones[6].innerText=mtoK(objeto[objeto.sol_keys[sol]].HWS.mn);
    mediciones[7].innerText=mtoK(objeto[objeto.sol_keys[sol]].HWS.av);
    mediciones[8].innerText=mtoK(objeto[objeto.sol_keys[sol]].HWS.mx); 

}

petición();
  
//Transformador de m/s a k/h
function mtoK(medida){
    const resultado=medida*3.6
    return Math.round(resultado)
}

// Counter
let contador=1;
let tamaño=sol_width.clientWidth; 
soles.style.transform=`translateX(${-tamaño*contador}px)`;

//Arreglando el problema del cambio de tamaño
var redimensionar;
window.addEventListener('resize',()=>{
    clearTimeout(redimensionar);
    redimensionar= setTimeout(redimensiónTerminada,200);
});
function redimensiónTerminada(){
    tamaño=sol_width.clientWidth;
    soles.style.transform=`translateX(${-tamaño*contador}px)`;
}

// Escuchadores de botones
botónD.addEventListener('click',()=>{
    if(contador>=8) return;
    tamaño=sol_width.clientWidth; 
    soles.style.transition= "transform 0.4s ease-in-out";
    contador++;
    soles.style.transform=`translateX(${-tamaño*contador}px)`;
    if(contador-1===-1)return;
    if(contador-1===7)return;
    medidas(json,contador-1);
})
botónI.addEventListener('click',()=>{
    if(contador<=0) return;
    tamaño=sol_width.clientWidth; 
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