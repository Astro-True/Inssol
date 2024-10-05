
// Función principal para renderizar la vista de usuarios
function renderUsuario() {
    // Selecciona el contenedor principal donde se mostrará la tabla
    const container = $("#view-container");
    // Limpia cualquier contenido previo en el contenedor
    container.empty();
    // Estructura HTML para la tabla de usuarios y los botones de actualizar y añadir
    const tablaHTML = `
    <div class=content-agregar>
    <div class="Add-Update" data-view="Usuario" id=btn-Actualizar>Actualizar</div>
    <div class="Add-Update" data-view="Usuario/Agregar" id=btn-agregar>Añadir</div>
    </div>
        <table id="datos-tabla">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>CI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Fecha de Nacimiento</th>
                <th>Domicilio</th>
                <th></th>
            </tr>
        </thead>
            <tbody>
            </tbody>
        </table>
        <div class="content"></div>
    `;
    // Agrega el HTML generado al contenedor
    container.append(tablaHTML);
    // Añade eventos a los botones con clase 'myButton'
    document.querySelectorAll('.myButton').forEach(button => {
        button.addEventListener('click', function () {
            // Obtiene la vista desde el atributo data-view
            const ruta = button.getAttribute('data-view'); 
            // Cambia la ruta del hash en la URL
            window.location.hash = ruta;
        });
    });
    // Evento para el botón "Actualizar", recarga la vista actual de usuarios
    document.getElementById('btn-Actualizar').addEventListener('click', function () {
        // Llama de nuevo a la función para refrescar la vista
        renderUsuario();
    });
    // Evento para el botón "Añadir", cambia la URL para la vista de agregar usuario
    document.getElementById('btn-agregar').addEventListener('click', function () {
        // Obtiene la vista desde el atributo data-view
        const ruta = this.getAttribute('data-view');
        // Cambia la ruta del hash en la URL
        window.location.hash = ruta;
    });
    // Llama a la función para obtener los datos de los usuarios
    obtenerDatos();
}

// Función para cargar los datos de usuarios en la tabla
function cargarDatosEnTabla(datos) {
    // Selecciona el cuerpo de la tabla
    const tabla = document.getElementById('datos-tabla').getElementsByTagName('tbody')[0];
    // Ordena los usuarios por nombre
    datos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    // Limpia la tabla antes de agregar los nuevos datos
    tabla.innerHTML = '';
    // Itera sobre los datos de los usuarios
    datos.forEach(dato => {
        // Inserta una nueva fila en la tabla
        let fila = tabla.insertRow();
        // Añade la celda con el nombre del usuario, ci, telefono, correo domicilio
        fila.insertCell(0).textContent = dato.nombre || 'N/A';
        fila.insertCell(1).textContent = dato.DatosPersonale.ci;
        fila.insertCell(2).textContent = dato.DatosPersonale.telefono;
        fila.insertCell(3).textContent = dato.DatosPersonale.Correo;
        // Convierte la fecha de nacimiento a formato local
        fila.insertCell(4).textContent = new Date(dato.DatosPersonale.FechaNacimiento).toLocaleDateString();
        fila.insertCell(5).textContent = dato.DatosPersonale.Domicilio;
        
        // Crea las acciones de editar y eliminar en la última celda
        let celdaAcciones = fila.insertCell(6);
        // Botón de editar
        let btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn-editar';
        btnEditar.onclick = function () {
            // Redirige a la vista de edición del usuario con su ID
            window.location.hash = `/Usuario/Editar/?idUsuario=${dato.id}`;
        };
        // Botón de eliminar
        let btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.onclick = function () {
            // Confirmación para eliminar al usuario
            if (confirm(`¿Estás seguro de que quieres eliminar a ${dato.nombre}?`)) {
                fetch(`${URL_SERVER}/Usuario/eliminar/${dato.id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar el usuario');
                        }
                        return response.json();
                    })
                    .then(result => {
                        alert('Usuario eliminado correctamente');
                        // Recarga los datos de la tabla después de eliminar
                        obtenerDatos();
                    })
                    .catch(error => {
                        console.error('Hubo un problema al eliminar el usuario:', error);
                        alert('Error al eliminar el usuario');
                    });
            }
        };
        // Añade el botón de editar, eliminar a la celda
        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);
    });
}

// Función para obtener los datos desde el servidor
function obtenerDatos() {
    // URL del servidor donde se obtienen los datos
    const url = `${URL_SERVER}/Usuario/lista`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            // Convierte la respuesta en un JSON
            return response.json();
        })
        .then(datos => {
            // Llama a la función para cargar los datos en la tabla
            cargarDatosEnTabla(datos);
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
            // Muestra un error en el DOM si falla
            document.getElementById('view-container').innerHTML = '<p>Error al cargar los datos.</p>';
        });
}

// Función para configurar el formulario de añadir usuario
function configurarFormulario() {
    // Muestra el formulario de añadir usuario
    document.getElementById("form-container").style.display = "block";
    document.getElementById("view-container").style.display = "none";
    // Añade el evento al botón "Cancelar"
    document.getElementById("cancelar").addEventListener("click", function () {
        // Oculta el formulario
        document.getElementById("form-container").style.display = "none";
        // Muestra la vista principal
        document.getElementById("view-container").style.display = "block";
    });
    // Maneja el envío del formulario de añadir usuario
    document.getElementById("add-form").addEventListener("submit", function (event) {
        // Previene el envío del formulario por defecto
        event.preventDefault();
        // Crea un objeto FormData con los datos del formulario
        const formData = new FormData(this);
        const data = {};
        // Convierte los datos del formulario a un objeto JSON
        formData.forEach((value, key) => {
            data[key] = value;
        });
        // Envía los datos del formulario al servidor
        fetch(`${URL_SERVER}/Usuario/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Envía los datos en formato JSON
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                // Muestra un mensaje de éxito
                alert('Usuario agregado exitosamente');
                // Oculta el formulario
                document.getElementById("form-container").style.display = "none";
                // Resetea el formulario
                document.getElementById("add-form").reset();
                // Recarga los datos de la tabla
                obtenerDatos();
                // Muestra la vista principal
                document.getElementById("view-container").style.display = "block";
            })
            .catch(error => {
                console.error('Error:', error);
                // Muestra un error en caso de fallo
                alert('Hubo un error al agregar el usuario');
            });
            // Muestra la vista principal después de procesar
        document.getElementById("view-container").style.display = "block";
    });
}
// Carga la vista de usuarios una vez que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', renderUsuario);