

const cargaScript = () => {

  //DIRECCIÓN SERVIDOR DONDE SE MONTA EL BACKEND
  const RutaServidor = "https://localhost:44311/";
   





  //===============FUNCIONES DE PETICIONES AJAX========================
     //BORRAR EQUIPO
     const borrarEquipo = (numID)=> {

      swal({
        title: "Eliminar Equipo",
        text: "Estas a punto de eliminar un equipo",
        icon: "warning",
        buttons: {
          Confirmar : "Confirmar",
          cancel : "Cancelar"

        }
      })
      .then((accionBorrar) => {
        if (accionBorrar == "Confirmar") {
                 
            
                
                fetch(RutaServidor + `api/FutbolDBEquipos/${numID}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: null
                })
                .then(res => {
            
                  swal("El equipo ha sido borrado con Exito", {
                    icon: "success",
                    timer:700,
                    buttons:false
                  }).then(cargarequipos())
                  
                });
          
        } 
      });


    }


    //CREAR EQUIPO
    const crearEquipo = (paramEquipo,paramColor) =>{

      const objetoAEnviar = {
        equipo : paramEquipo,
        color : paramColor
      };

      fetch(RutaServidor + "api/FutbolDBEquipos",{
        method : 'POST',
        headers : {
          'Content-Type':'application/json'
        },
          body : JSON.stringify(objetoAEnviar)
        })
        .then(res => {
          swal("El equipo ha sido agregado con Exito", {
            icon: "success",
            timer:700,
            buttons:false
          }).then( ()=>{
            cargarequipos();
            mostrarFormularioEquiposcrear();
          })
        })

    }



    //EDITAR EQUIPO
    const editarEquipo = (paramid,paramnomEquipo,paramcolorEquipo) =>{

      const objetoAEnviar = {
        id : paramid,
        equipo : paramnomEquipo,
        color : paramcolorEquipo
      };

      fetch(RutaServidor + "api/FutbolDBEquipos/" + paramid,{
        method : 'PUT',
        headers : {
          'Content-Type':'application/json'
        },
          body : JSON.stringify(objetoAEnviar)
        })
        .then(res => {
          swal("El equipo ha sido actualizado con Exito", {
            icon: "success",
            timer:700,
            buttons:false
          }).then(cargarequipos())
        })
        



    }


    
    //ELIMINAR JUGADORA
    const eliminarJugadora = (numID,nombreEquipo) =>{
      

      swal({
        title: "Eliminar Jugadora",
        text: "Estas a punto de eliminar una jugadora",
        icon: "warning",
        buttons: {
          Confirmar : "Confirmar",
          cancel : "Cancelar"

        }
      })
      .then((accionBorrar) => {
        if (accionBorrar == "Confirmar") {
    
        fetch(RutaServidor + "api/FutbolDBJugadoras/" + numID,{
          method : "DELETE",
          headers: {
            'Content-Type': 'application/json'
          },
          body: null
        })
        .then(res => {
    
          swal("La jugadora ha sido eliminada con Exito", {
            icon: "success",
            timer:700,
            buttons:false
          })
          .then(() => {
            cargarJugadoras(nombreEquipo);
          })
          
        });
          
        } 
      });



    }


    //CREAR NUEVA JUGADORA
    const crearJugadora = (dniJugadora,nombreJugadora,apellidoJugadora,equipoJugadora)=>{

      
      const objetoAEnviar = {
        dni : dniJugadora,
        nombre : nombreJugadora,
        apellido : apellidoJugadora,
        equipojugando : equipoJugadora
      }
      console.log(typeof(JSON.stringify(objetoAEnviar)));

      fetch(RutaServidor + "api/FutbolDBJugadoras",{
        method : 'POST',
        headers : {
          'Content-Type':'application/json'
        },
          body : JSON.stringify(objetoAEnviar)
        })
        .then((e)=>{
          console.log(e);
          swal("La jugadora fue agregada con Exito", {
            icon: "success",
            timer:700,
            buttons:false
          })
          .then( () =>{
            if(!document.getElementById("listado-jugadoras").classList.contains("d-none")){
              cargarJugadoras(equipoJugadora);
            }
          });
        })
        .catch(e =>{
          console.log(e)
        })



    }

    //CARGAR JUGADORAS
      const cargarJugadoras = (nombreEquipo) =>{
      fetch(RutaServidor + "api/FutbolDBJugadoras/multiple/" + nombreEquipo)
      .then(res => res.json())
      .then(res => {
        document.getElementById("listado-jugadoras").classList.remove("d-none")
        const contenedorJugadoras = document.getElementById("listado-jugadoras-contenedor");
        contenedorJugadoras.innerHTML="";
        contenedorJugadoras.getAttribute("id","listado-jugadoras-contenedor");
        //contenedorJugadoras.getAttribute("data-filter",res[0].equipo)
        
        var banderaVectorNulo = false;
        if(res.length < 1)
        {
          banderaVectorNulo = true;
        } else{


          res.forEach(res => {
          

            const elementoJugadora = document.createElement("LI");
            elementoJugadora.classList.add("list-group-item");
            elementoJugadora.classList.add("d-flex");
            elementoJugadora.classList.add("p-3");
            elementoJugadora.setAttribute("data-id",res.id)
            elementoJugadora.setAttribute("data-equipo",res.equipojugando)
            elementoJugadora.innerHTML=`
            
              <i class="  far fa-user  px-3 "></i>
              <div class="nombre-apellido">
                <span class="nombre fs-6"><span>${res.nombre}</span> <span>${res.apellido}</span></span> <br><span class="dni fs-6"><span>DNI: </span><span>${res.dni}</span></span>
              </div>
                <button id="eliminar-jugadora"class="boton-listado-jugadores border-0">
                  <i  class="eliminar-jugadora far fa-trash-alt position-absolute start-100 top-0 bg-danger text-light rounded"></i>
                </button>
                <button id="editar-jugadora"class="boton-listado-jugadores border-0">
                <i  class="editar-jugadora far fa-edit position-absolute start-100 top-0 text-primary rounded"></i>
                </button>
            
            `;
            
            contenedorJugadoras.appendChild(elementoJugadora);
            
          })


        }
        

       

        if(banderaVectorNulo){
          contenedorJugadoras.innerHTML=`<p class="fs-6 text-center">El equipo no tiene jugadoras aún</p>`;
          contenedorJugadoras.getAttribute("id","listado-jugadoras-contenedor");
        } else{


            //AGREGO FUNCIONALIDAD AL BOTON BORRAR
            document.querySelectorAll("#eliminar-jugadora").forEach(btn => {
              btn.addEventListener("click",(e)=>{
                const elementoJugadora = e.target.parentElement.parentElement;
                eliminarJugadora(elementoJugadora.getAttribute("data-id"),elementoJugadora.getAttribute("data-equipo"));
                
                
            })
            })


            //AGREGO FUNCIONALIDAD AL BOTON EDITAR
            document.querySelectorAll("#editar-jugadora").forEach(btn => {
              btn.addEventListener("click",(e)=>{
                const elementoJugadora = e.target.parentElement.parentElement;
                const nombreJugadora = elementoJugadora.children[1].children[0].children[0].textContent;
                const apellidoJugadora = elementoJugadora.children[1].children[0].children[1].textContent;
                const dniJugadora = elementoJugadora.children[1].children[2].children[1].textContent;
                const idJugadora = elementoJugadora.getAttribute("data-id");
                const equipoJugadora = elementoJugadora.getAttribute("data-equipo");

                const formulario = document.getElementById("formulario-edicion-jugadora");
                formulario.children[1].children[1].value = nombreJugadora;
                formulario.children[2].children[1].value = apellidoJugadora;
                formulario.children[3].children[1].value = dniJugadora;
                formulario.children[4].value = equipoJugadora;
                formulario.setAttribute("data-id",idJugadora)
                formulario.classList.remove("formulario-hidden");
                
            })
            })


        }
        
        
        
          

      })
    }

    //EDITAR DATOS DE UNA JUGADORA
    const editarJugadora = (idJugadora,nombreJugadora,apellidoJugadora,dniJugadora,equipoJugadora) =>{

      const objetoAEnviar = {
        id : idJugadora,
        nombre : nombreJugadora,
        apellido : apellidoJugadora,
        dni : dniJugadora,
        equipojugando : equipoJugadora
      }


      fetch(RutaServidor + "api/FutbolDBJugadoras/" + idJugadora,{
      method : "PUT",
      headers : {
        'Content-Type':'application/json'
      },
        body : JSON.stringify(objetoAEnviar)
      })
      .then(res => {
          
          if(res.status<400)
        {
          swal("La jugadora ha sido actualizada con exito", {
            icon: "success",
            timer:700,
            buttons:false
          })
          const form_Jugadora_editar =  document.getElementById("formulario-edicion-jugadora");
          form_Jugadora_editar.classList.add("formulario-hidden")
          panelJugadores = document.getElementById("listado-jugadoras");
          cargarJugadoras(panelJugadores.getAttribute("data-filter")); 
        }   


      })
      
      
      
      //formulario.children[4].value = equipoJugadora;
    }




   //==========================================================================


    //===========================FORMULARIO CREAR JUGADORA==================================
    document.getElementById("crear-nueva-jugadora").addEventListener("click",(e)=>{
      e.preventDefault();
      const nombreJugadora = e.target.parentElement.children[0].children[1].value;
      const apellidoJugadora = e.target.parentElement.children[1].children[1].value;
      var dniJugadora = e.target.parentElement.children[2].children[1].value;
      dniJugadora = parseInt(dniJugadora);
      console.log(typeof(dniJugadora));
      const equipoJugadora = e.target.parentElement.children[3].value;

      crearJugadora(dniJugadora,nombreJugadora,apellidoJugadora,equipoJugadora);
  


    },false);



    //===================================================================================





   //===========================FORMULARIO EDITAR EQUIPOS==================================
   const form_equipo_editar = document.getElementById("formulario-edicion");
   const boton_cancelar_editar = document.getElementById("cancelar-edicion");
   const input_nombreEquipo_editar = document.getElementById("input-nombreEquipo-Editar");
   const input_colorEquipo_editar = document.getElementById("input-colorEquipo-Editar");
   form_equipo_editar.addEventListener("submit",(e)=>{

       e.preventDefault()
       
       const nombreEquipo = e.target[0].value;
       const colorEquipo = e.target[1].value;
       const id = e.target.getAttribute("data-id");
       console.log(nombreEquipo);
       console.log(colorEquipo);
       console.log(id);
       mostrarFormularioEquiposEditar("esconder");
       editarEquipo(id,nombreEquipo,colorEquipo);


   },false)
   boton_cancelar_editar.addEventListener("click",(e)=>{
    e.preventDefault();
    mostrarFormularioEquiposEditar("esconder");
   },false)


   //MOSTRAR FORMULARIO
   const mostrarFormularioEquiposEditar = (opcion,nombre,color,id) =>{
     if(opcion=="mostrar"){
      form_equipo_editar.classList.add("top-50");
      form_equipo_editar.classList.add("start-50");
      form_equipo_editar.classList.remove("formulario-hidden");

      input_nombreEquipo_editar.value=nombre;
      input_colorEquipo_editar.value=color;
      form_equipo_editar.setAttribute("data-id",id)
     } else if(opcion=="esconder")
     {
      form_equipo_editar.classList.remove("top-50");
      form_equipo_editar.classList.remove("start-50");
      form_equipo_editar.classList.add("formulario-hidden");
     }
 
               
   }

   //============================================================================



   //===========================FORMULARIO CREAR EQUIPOS==================================
   const form_equipo_crear = document.getElementById("formulario-creacion");
   const boton_cancelar_crear = document.getElementById("cancelar-creacion");
   const input_nombreEquipo_crear = document.getElementById("input-nombreEquipo-crear");
   const input_colorEquipo_crear = document.getElementById("input-colorEquipo-crear");
   form_equipo_crear.addEventListener("submit",(e)=>{

       e.preventDefault()
       
       const nombreEquipo = e.target[0].value;
       const colorEquipo = e.target[1].value;
       crearEquipo(nombreEquipo,colorEquipo);


   },false)
   boton_cancelar_crear.addEventListener("click",(e)=>{
      e.preventDefault();
      mostrarFormularioEquiposcrear();
   },false)



   //MOSTRAR FORMULARIO
   const mostrarFormularioEquiposcrear = () => {
      form_equipo_crear.classList.toggle("top-50");
      form_equipo_crear.classList.toggle("start-50");
      form_equipo_crear.classList.toggle("formulario-hidden");       
   }
   
    //============================================================================
   



     //===========================FORMULARIO EDITAR JUGADORAS==================================
     const form_Jugadora_editar =  document.getElementById("formulario-edicion-jugadora");
     const btn_cancelar_edicion = document.getElementById("cancelar-editar-jugadora");
      btn_cancelar_edicion.addEventListener("click",(e)=>{
          e.preventDefault();
          form_Jugadora_editar.classList.add("formulario-hidden");
      });
      const btn_submit_edicion = document.getElementById("submit-editar-jugadora");
      btn_submit_edicion.addEventListener("click",()=>{
        const idJugadora = btn_submit_edicion.parentElement.parentElement.getAttribute("data-id");
        const nombreJugadora = form_Jugadora_editar.children[1].children[1].value;
        const apellidoJugadora = form_Jugadora_editar.children[2].children[1].value;
        const dniJugadora = form_Jugadora_editar.children[3].children[1].value;
        const equipoJugadora = form_Jugadora_editar.children[4].value;
        editarJugadora(idJugadora,nombreJugadora,apellidoJugadora,dniJugadora,equipoJugadora,form_Jugadora_editar);
      })






















     //============================================================================









   


   //============================================================================



    //===============CARGO EQUIPOS DE API Y LOS INSERTO EN LA PAGINA===========
    const cargarequipos = ()=>{
      
      //EVALUO SI YA HAY EQUIPOS CARGADOS Y SI OS HAY, LOS BORRO
      const contenedorEquipos = document.getElementById("contenedor-equipos");
      if (contenedorEquipos.hasChildNodes)
      {
        contenedorEquipos.innerHTML="";
      }
      

      const equipos = fetch(RutaServidor + "api/FutbolDBEquipos")
      .then(res => res.json())
      .then(res => {

            //SELECCIONNO FORMULARIO DE JUGADORAS PARA MAS TARDE AGREGARLE OPCIONES
            //DE EQUIPO
            const menu_equipos = document.getElementById("selector-equipo");
            const menu_equipos_edicion = document.getElementById("selector-equipo-edicion");
            

            //AGREGO EQUIPOS EN EL HTML
            
            for(var equipo of res)
            {
                const card = document.createElement("DIV");
                const htmlAAgregar = `
                <div class="card-body position-relative" data-id="${equipo.id}">
                        <div class="card pt-5 pb-2">
                          <i class="fas fa-shield-alt d-flex justify-content-center fs-1"></i>
                          <div class="card-body">
                            <h5 class="card-title d-flex justify-content-center">${equipo.equipo}</h5>
                            <hr class="divisor-3 mb-3">
                            <p class="card-text text-center">Camiseta de color <span>${equipo.color}</span></p> 
                          </div>
                        </div>
                        <div class="botones-acciones d-flex position-absolute" >
                          <button title="Ver Jugadores" id="btn-ver" class="bg-success border-0  px-2 py-1 m-1 rounded-circle text-dark shadown-hover"><i class="far fa-eye"></i></button>
                          <button title="Editar" id="btn-editar" class="bg-warning border-0  px-2 py-1 m-1 rounded-circle text-gray shadown-hover" ><i class="far fa-edit fa-1x"></i></button>
                          <button href="#listado-jugadoras" title="Eliminar" id="btn-eliminar" class="bg-danger border-0 px-2 p-1 m-1 rounded-circle text-light shadown-hover" ><i id="i-eliminar" class="far fa-trash-alt fa-1x"></i></button>
                        </div>
                      </div>

                `;
                card.innerHTML =htmlAAgregar;
                contenedorEquipos.appendChild(card)

                //AGREGO OPCION DE EQUIPO AL FORMULARIO DE JUGADORAS
                const opcionAAgregarCrear = `<option value="${equipo.id}">${equipo.equipo}</option>`;
                const opcionMenuEquiposCrear = document.createElement("option");
                opcionMenuEquiposCrear.innerHTML=opcionAAgregarCrear;


                const opcionAAgregarEditar = `<option value="${equipo.id}">${equipo.equipo}</option>`;
                const opcionMenuEquiposEditar = document.createElement("option");
                opcionMenuEquiposEditar.innerHTML=opcionAAgregarEditar;

                
                menu_equipos_edicion.appendChild(opcionMenuEquiposEditar);
                menu_equipos.appendChild(opcionMenuEquiposCrear);
            }
            const HtmlBtnFinal = `
            <div class="agregar-equipo d-flex justify-content-center align-items-center text-dark">
                        <button class="bg-light border-0  p-4 rounded "><i class="fas fa-plus px-3"></i><p class="font-weight-light">Agregar Equipo</p></button>
                      </div>`;

            const btnFinal = document.createElement("DIV");
            btnFinal.innerHTML=HtmlBtnFinal;
            btnFinal.addEventListener("click",()=>{
              mostrarFormularioEquiposcrear();
            },false)
            contenedorEquipos.appendChild(btnFinal);




            //==============ACCION BOTON BORRAR============================
            document.querySelectorAll("#btn-eliminar").forEach(btn => {
            
              btn.addEventListener("click",(e)=>{
                const numID = e.target.parentElement.parentElement.getAttribute("data-id");
                //SOLUCION AL ERROR DEL METODO TARGET DEL EVENTO
                if(numID == null){
                  btn.click();
                }else{
                  borrarEquipo(numID);
                }
        
              },false);

            });




             //==============ACCION BOTON EDITAR============================
             document.querySelectorAll("#btn-editar").forEach(btn => {
            
              btn.addEventListener("click",(e)=>{
                
                
                //SOLUCION AL ERROR DEL METODO TARGET DEL EVENTO
                if(e.target.classList.contains("far")){
                  btn.click();
                }else{
                  const id_equipo = e.target.parentElement.parentElement.getAttribute("data-id");
                  const nombre_equipo = e.target.parentElement.previousSibling.previousSibling.children[1].children[0].textContent;
                  const color_equipo = e.target.parentElement.previousSibling.previousSibling.children[1].children[2].children[0].textContent;
                  mostrarFormularioEquiposEditar("mostrar",nombre_equipo,color_equipo,id_equipo);

                  
                }
        
              },false);

            }
            
            
            );





            
             //==============ACCION BOTON VER============================
             document.querySelectorAll("#btn-ver").forEach(btn => {
            
              btn.addEventListener("click",(e)=>{
                
                
                //SOLUCION AL ERROR DEL METODO TARGET DEL EVENTO
                if(e.target.classList.contains("far")){
                  btn.click();
                }else{
                  
                  const panelJugadoras = document.getElementById("listado-jugadoras");
                  panelJugadoras.classList.remove("d-none");
                  const nombre_equipo = e.target.parentElement.previousSibling.previousSibling.children[1].children[0].textContent;
                  panelJugadoras.setAttribute("data-filter",nombre_equipo);
                  location.href="#listado-jugadoras";
                  cargarJugadoras(nombre_equipo);
                  
                }
        
              },false);

            }
            
            
            );





            })
            .catch(e =>{
              console.log(e);
            });
            
       
    }
    //============================================================================

 
    //  COLAPSADORES===========================================================
    
    const flechaColapsarFormulario = document.getElementById("flecha-colapsador-formularioJugadora");
    flechaColapsarFormulario.addEventListener("click",()=>{
      flechaColapsarFormulario.classList.toggle("colapsador-down-active");
      document.getElementById("formulario-colapsable").classList.toggle("d-none");
    })




    const flechaColapsarListado = document.getElementById("flecha-colapsador-listadoJugadoras");
    flechaColapsarListado.addEventListener("click",()=>{
      flechaColapsarListado.classList.toggle("colapsador-down-active");
      document.getElementById("listado-colapsable").classList.toggle("d-none")
    })
    //============================================================================







    //LLAMADA A FUNCION
    cargarequipos();

}


window.onload = cargaScript;