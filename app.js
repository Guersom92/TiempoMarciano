//Declaración y asignación de variables
const key="OpPuUxDOwbZHZCnQnaYKJRRN4pTcI92ocf3I0jVF";
const solesContenedor=document.querySelector(".soles");
const flechaIzquierda= document.getElementById("left");
const flechaDerecha= document.getElementById("right");
const mediciones=document.querySelectorAll("section span");
let índiceActual=0;
let json;

//Función de fecha
function cambiarFormato(fecha){
    return fecha.toLocaleDateString(undefined,{ day:"numeric", month: "long"})  
}

//Transformador de m/s a k/h
function mtoK(medida){
    const resultado=medida*3.6;
    return Math.round(resultado);
}
//Modificador de datos
function modificadorSoles([sol,data]){
    return{
        tMin:Math.round(data.AT.mn),
        tMed:Math.round(data.AT.av),
        tMax:Math.round(data.AT.mx),
        pMin:Math.round(data.PRE.mn),
        pMed:Math.round(data.PRE.av),
        pMax:Math.round(data.PRE.mx),
        vMin:mtoK(data.HWS.mn),
        vMed:mtoK(data.HWS.av),
        vMax:mtoK(data.HWS.mx)
        
    }
        
}
//Función de establecer datos
function esablecerDatos(índice,newData){
    if(newData)return;
    mediciones[0].innerHTML=newData[índice].tMin;
    mediciones[1].innerHTML=newData[índice].tMed;
    mediciones[2].innerHTML=newData[índice].tMax;
    mediciones[3].innerHTML=newData[índice].pMin;
    mediciones[4].innerHTML=newData[índice].pMed;
    mediciones[5].innerHTML=newData[índice].pMax;
    mediciones[6].innerHTML=newData[índice].vMin;
    mediciones[7].innerHTML=newData[índice].vMed;
    mediciones[8].innerHTML=newData[índice].vMax;
}

//Función de dezplazamiento
function desplazamientoDeContenedor(){
    let ancho= document.querySelector(".sol").getBoundingClientRect().width;
    solesContenedor.style.transform=`translateX(-${ancho*índiceActual}px)`;
}
//Función para ocultar flechas
function ocultarFlechas(keys) {
    if(índiceActual===0){flechaIzquierda.classList.add("oculto")}
    else if(índiceActual===keys.length-1) flechaDerecha.classList.add("oculto")
    else{
        flechaIzquierda.classList.remove("oculto");
        flechaDerecha.classList.remove("oculto");
    }
}
//Función de manejo de evento de flechas
function manejadorEventoDeFlechas(number,datos,keys){
    if(índiceActual+number<0||índiceActual+number>keys.length-1)return
    índiceActual=índiceActual+number;
    esablecerDatos(índiceActual,datos);
    desplazamientoDeContenedor();
    ocultarFlechas(keys);
}

//Función de llamada al API
async function petición(){
    const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`)
    json= await response.json();
    let {sol_keys,validity_checks,...solData} =json;
    const newData=Object.entries(solData).map(modificadorSoles);
    if(sol_keys.lenght>0){
        for(d of sol_keys){
            let fecha = new Date(json[d].First_UTC);
            const fechaFormateada=cambiarFormato(fecha);
            solesContenedor.innerHTML+=`
            <div class="sol">
                <div>Sol</div>
                <span class="día" >${d}</span>
                <span class="fecha">${fechaFormateada}</span>
            </div>`;
        }
    }
    else{
        flechaDerecha.classList.add("oculto");
        solesContenedor.innerHTML+=`
        <div class="sol">
            no data
        </div>`;
    }

    esablecerDatos(índiceActual,newData);

    flechaDerecha.addEventListener("click",(e)=>{
        manejadorEventoDeFlechas(1,newData,sol_keys);
    });

    flechaIzquierda.addEventListener("click",(e)=>{
        manejadorEventoDeFlechas(-1,newData,sol_keys);
    });

    document.addEventListener("keydown",(e)=>{
        if(e.key!="ArrowLeft" && e.key!="ArrowRight")return 
        if(e.key==="ArrowLeft")manejadorEventoDeFlechas(-1,newData,sol_keys);
        if(e.key==="ArrowRight")manejadorEventoDeFlechas(1,newData,sol_keys);
    })

}    
    

petición();


