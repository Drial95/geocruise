// Esperamos a que el navegador construya por completo el árbol del DOM
document.addEventListener("DOMContentLoaded", function () {

    // 1. ACCESO A ELEMENTOS DEL DOM
    var enlacesFiltro = document.getElementsByClassName("enlace-filtro");
    var entradasCrucero = document.getElementsByClassName("entrada-crucero");
    var mensajeResultados = document.getElementById("mensaje-resultados");
    var campoBusqueda = document.getElementById("campo-busqueda");
    var btnLimpiarBusqueda = document.getElementById("btn-limpiar-busqueda");

    var botonesItinerario = document.getElementsByClassName("btn-itinerario");
    var botonesFavorito = document.getElementsByClassName("btn-favorito");

    var btnTema = document.getElementById("btn-tema");
    var btnFuenteMenos = document.getElementById("btn-fuente-menos");
    var btnFuenteNormal = document.getElementById("btn-fuente-normal");
    var btnFuenteMas = document.getElementById("btn-fuente-mas");
    var btnSubir = document.getElementById("btn-subir");

    var formularioComentarios = document.getElementById("formulario-comentarios");
    var listaComentarios = document.getElementById("lista-comentarios");
    var totalComentarios = document.getElementById("total-comentarios");
    var errorFormulario = document.getElementById("error-formulario");

    // Estado actual del filtrado y del tamaño de fuente
    var filtroActual = "todos";
    var tamanoFuente = 16;

    // 2. FILTRADO POR RUTA Y BUSCADOR EN TIEMPO REAL
    function actualizarEntradasVisibles() {
        var textoBuscado = campoBusqueda.value.trim().toLowerCase();
        var contadorVisibles = 0;

        for (var i = 0; i < entradasCrucero.length; i++) {
            var articulo = entradasCrucero[i];
            var region = articulo.getAttribute("data-region");
            var contenidoTexto = articulo.textContent.toLowerCase();

            var coincideRegion = (filtroActual === "todos") || (region === filtroActual);
            var coincideTexto = (textoBuscado === "") || (contenidoTexto.indexOf(textoBuscado) !== -1);

            if (coincideRegion && coincideTexto) {
                articulo.classList.remove("oculta");
                contadorVisibles++;
            } else {
                articulo.classList.add("oculta");
            }
        }

        // Actualizamos el mensaje de estado en el DOM
        if (contadorVisibles === 0) {
            mensajeResultados.textContent = "No se han encontrado cruceros que coincidan con '" + campoBusqueda.value.trim() + "'.";
        } else if (contadorVisibles === 1) {
            mensajeResultados.textContent = "Mostrando 1 entrada de crucero.";
        } else {
            mensajeResultados.textContent = "Mostrando " + contadorVisibles + " entradas de cruceros.";
        }
    }

    // Eventos de clic en los enlaces de navegación para filtrar las entradas
    for (var i = 0; i < enlacesFiltro.length; i++) {
        enlacesFiltro[i].addEventListener("click", function (evento) {
            evento.preventDefault();

            // Quitamos la clase 'activo' de todos los enlaces del menú
            for (var j = 0; j < enlacesFiltro.length; j++) {
                enlacesFiltro[j].classList.remove("activo");
            }
            this.classList.add("activo");

            filtroActual = this.getAttribute("data-filtro");
            actualizarEntradasVisibles();

            // Desplazamos suavemente hacia el inicio de las entradas
            document.getElementById("contenido-blog").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Evento 'input' para filtrar mientras el usuario escribe en el buscador
    campoBusqueda.addEventListener("input", function () {
        actualizarEntradasVisibles();
    });

    // Botón para limpiar el cuadro de búsqueda
    btnLimpiarBusqueda.addEventListener("click", function () {
        campoBusqueda.value = "";
        actualizarEntradasVisibles();
        campoBusqueda.focus();
    });

    // 3. DESPLEGAR / OCULTAR TABLA DE ESCALAS DE CADA CRUCERO
    for (var k = 0; k < botonesItinerario.length; k++) {
        botonesItinerario[k].addEventListener("click", function () {
            var idObjetivo = this.getAttribute("data-objetivo");
            var bloque = document.getElementById(idObjetivo);

            if (bloque.classList.contains("colapsado")) {
                bloque.classList.remove("colapsado");
                this.textContent = "Ocultar tabla de escalas";
            } else {
                bloque.classList.add("colapsado");
                this.textContent = "Mostrar tabla de escalas";
            }
        });
    }

    // 4. BOTÓN "ME GUSTA" INTERACTIVO EN CADA ENTRADA
    for (var m = 0; m < botonesFavorito.length; m++) {
        botonesFavorito[m].addEventListener("click", function () {
            var spanContador = this.getElementsByClassName("contador-likes")[0];
            var numeroActual = parseInt(spanContador.textContent, 10);

            if (this.classList.contains("pulsado")) {
                this.classList.remove("pulsado");
                spanContador.textContent = numeroActual - 1;
            } else {
                this.classList.add("pulsado");
                spanContador.textContent = numeroActual + 1;
            }
        });
    }

    // 5. MODO OSCURO Y CONTROL DE TAMAÑO DE FUENTE
    btnTema.addEventListener("click", function () {
        document.body.classList.toggle("modo-oscuro");

        if (document.body.classList.contains("modo-oscuro")) {
            btnTema.textContent = "Modo claro";
        } else {
            btnTema.textContent = "Modo oscuro";
        }
    });

    btnFuenteMenos.addEventListener("click", function () {
        if (tamanoFuente > 12) {
            tamanoFuente -= 1;
            document.documentElement.style.fontSize = tamanoFuente + "px";
        }
    });

    btnFuenteNormal.addEventListener("click", function () {
        tamanoFuente = 16;
        document.documentElement.style.fontSize = tamanoFuente + "px";
    });

    btnFuenteMas.addEventListener("click", function () {
        if (tamanoFuente < 20) {
            tamanoFuente += 1;
            document.documentElement.style.fontSize = tamanoFuente + "px";
        }
    });

    // 6. FORMULARIO DINÁMICO DE COMENTARIOS
    function actualizarContadorComentarios() {
        var items = listaComentarios.getElementsByClassName("comentario-item");
        totalComentarios.textContent = items.length;
    }

    formularioComentarios.addEventListener("submit", function (evento) {
        // Evitamos que la página se recargue al enviar el formulario
        evento.preventDefault();

        var nombre = document.getElementById("nombre-autor").value.trim();
        var correo = document.getElementById("correo-autor").value.trim();
        var ruta = document.getElementById("ruta-comentario").value;
        var comentario = document.getElementById("texto-comentario").value.trim();

        // Validación básica de campos
        if (nombre === "" || correo === "" || comentario === "") {
            errorFormulario.textContent = "Por favor, rellena todos los campos obligatorios marcados con *.";
            return;
        }

        if (correo.indexOf("@") === -1 || correo.indexOf(".") === -1) {
            errorFormulario.textContent = "Introduce un correo electrónico con formato válido.";
            return;
        }

        errorFormulario.textContent = "";

        // Creamos los nodos HTML del nuevo comentario mediante el DOM
        var nuevoArticulo = document.createElement("article");
        nuevoArticulo.className = "comentario-item";

        var cabecera = document.createElement("header");
        cabecera.className = "comentario-cabecera";

        var autorElemento = document.createElement("strong");
        autorElemento.appendChild(document.createTextNode(nombre));

        var etiquetaElemento = document.createElement("span");
        etiquetaElemento.className = "comentario-etiqueta";
        etiquetaElemento.appendChild(document.createTextNode(ruta));

        cabecera.appendChild(autorElemento);
        cabecera.appendChild(etiquetaElemento);

        var parrafo = document.createElement("p");
        parrafo.appendChild(document.createTextNode(comentario));

        // Botón para permitir eliminar el comentario recién añadido
        var btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.className = "btn-eliminar-comentario";
        btnEliminar.appendChild(document.createTextNode("Eliminar comentario"));

        btnEliminar.addEventListener("click", function () {
            var nodoComentario = this.parentNode;
            nodoComentario.parentNode.removeChild(nodoComentario);
            actualizarContadorComentarios();
        });

        // Encapsulamos el comentario y lo añadimos al DOM
        nuevoArticulo.appendChild(cabecera);
        nuevoArticulo.appendChild(parrafo);
        nuevoArticulo.appendChild(btnEliminar);

        listaComentarios.appendChild(nuevoArticulo);
        actualizarContadorComentarios();

        // Reiniciamos el formulario
        formularioComentarios.reset();
    });

    // 7. BOTÓN FLOTANTE "VOLVER ARRIBA"
    window.addEventListener("scroll", function () {
        if (window.scrollY > 320) {
            btnSubir.classList.add("visible");
        } else {
            btnSubir.classList.remove("visible");
        }
    });

    btnSubir.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

});
