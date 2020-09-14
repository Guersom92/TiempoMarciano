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
    let temperatura,presión,viento;
    if(data.hasOwnProperty("AT")){
        temperatura={
            tMin:Math.round(data.AT.mn),
            tMed:Math.round(data.AT.av),
            tMax:Math.round(data.AT.mx)}
    }
    if(data.hasOwnProperty("PRE")){
        presión={
            pMin:Math.round(data.PRE.mn),
            pMed:Math.round(data.PRE.av),
            pMax:Math.round(data.PRE.mx)
        }
    }
    if(data.hasOwnProperty("HWS")){
        viento={
            vMin:mtoK(data.HWS.mn),
            vMed:mtoK(data.HWS.av),
            vMax:mtoK(data.HWS.mx)
        }
    }
    return{
        ...temperatura,...presión,...viento
    }
        
}
//Función de establecer datos
function establecerDatos(índice,newData){
    if(newData.length<=0)return;
    mediciones[0].innerHTML=newData[índice].tMin?newData[índice].tMin+"°C":"n/a";
    mediciones[1].innerHTML=newData[índice].tMed?newData[índice].tMed+"°C":"n/a";
    mediciones[2].innerHTML=newData[índice].tMax?newData[índice].tMax+"°C":"n/a";
    mediciones[3].innerHTML=newData[índice].pMin?newData[índice].pMin+" Pa":"n/a";
    mediciones[4].innerHTML=newData[índice].pMed?newData[índice].pMed+" Pa":"n/a";
    mediciones[5].innerHTML=newData[índice].pMax?newData[índice].pMax+" Pa":"n/a";
    mediciones[6].innerHTML=newData[índice].vMin?newData[índice].vMin+" k/h":"n/a";
    mediciones[7].innerHTML=newData[índice].vMed?newData[índice].vMed+" k/h":"n/a";
    mediciones[8].innerHTML=newData[índice].vMax?newData[índice].vMax+" k/h":"n/a";
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
    establecerDatos(índiceActual,datos);
    desplazamientoDeContenedor();
    ocultarFlechas(keys);
}

//Función de llamada al API
async function petición(){
    try{
        const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${key}&feedtype=json&ver=1.0`)
        json= await response.json();
        let {sol_keys,validity_checks,...solData} =json;
        const newData=Object.entries(solData).map(modificadorSoles);
        if(sol_keys.length>0){
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
        establecerDatos(índiceActual,newData);

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
    }catch(e){
        console.log(e);
        flechaDerecha.classList.add("oculto");
            solesContenedor.innerHTML+=`
            <div class="sol">
                no data
            </div>`;
    }

}    
    

petición();


