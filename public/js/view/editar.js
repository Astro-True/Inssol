function obtenerDatosUsuario(id) {
    fetch(`${URL_SERVER}/Usuario/detalle/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            renderEditar(data);
        } else {
            console.error("No se encontraron datos para este usuario");
        }
    })
    .catch(error => {
        console.error("Error al obtener datos del usuario:", error);
    });

}
function renderEditar(dato) {
    console.log("Dato en renderEditar:", dato);
  const container = $("#view-container");
  container.empty();
  const formHTML = `
        <div id="form-container">
            <h2>Editar Usuario</h2>
            <form id="add-form">
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required autocomplete="username">
                </div>
                <div class="form-group">
                    <label for="contrasenia">Contraseña:</label>
                    <input type="password" id="contrasenia" name="contrasenia" required autocomplete="current-password">
                </div>
                <div class="form-group">
                    <label for="ci">CI:</label>
                    <input type="text" id="ci" name="ci" required>
                </div>
                <div class="form-group">
                    <label for="telefono">Teléfono:</label>
                    <input type="text" id="telefono" name="telefono" required>
                </div>
                <div class="form-group">
                    <label for="correo">Correo:</label>
                    <input type="email" id="correo" name="correo" required>
                </div>
                <div class="form-group">
                    <label for="fechanacimiento">Fecha de Nacimiento:</label>
                    <input type="date" id="fechanacimiento" name="fechanacimiento" required>
                </div>
                <div class="form-group">
                    <label for="domicilio">Domicilio:</label>
                    <input type="text" id="domicilio" name="domicilio" required>
                </div>
                <div class="form-group">
                    <label for="gradoacademico">GradoAcademico:</label>
                    <input type="text" id="gradoacademico" name="gradoacademico" required>
                </div>
                <div class="form-group">
                    <label for="areaespecializacion">AreaEspecializacion:</label>
                    <input type="text" id="areaespecializacion" name="areaespecializacion" required>
                </div>
                <div class="form-group">
                    <label for="grado">Grado:</label>
                    <input type="text" id="grado" name="grado" required>
                </div>
                <div class="form-group">
                    <label for="roles">Rol:</label>
                        <select id="select-roles" name="roleid">
                            <option id="roleid" value="">Seleccione un rol</option>
                        </select>
                </div>
                <div class="btn-form">
                    <button class="button-28" type="submit" id="enviar-form"><span class="text">Enviar</span></button>
                    <button class="button-28" type="button" id="cancelar-form">Cancelar</button>
                </div>
            </form>
        </div>
    `;
  container.append(formHTML);
  //cargarRolesEnSelect(dato.RoleId);
//   if (dato) {
//     configurarFormularioActualizar(dato);
// } else {
//     console.error('Los datos del usuario no están disponibles');
// }
cargarRolesEnSelect(() => {
    if (dato) {
        configurarFormularioActualizar(dato);
    } else {
        console.error('Los datos del usuario no están disponibles');
    }
});
}
function configurarFormularioActualizar(dato) {
    console.log(dato);
    // Verificar que el objeto `dato` y sus propiedades existan
    if (!dato || !dato.DatosPersonale || !dato.DatosAcademico) {
        console.error('El objeto dato o sus propiedades anidadas no están definidas.');
        return;
    }

    // Mostrar el formulario
    document.getElementById("form-container").style.display = "block";
    //document.getElementById("view-container").style.display = "none";
    document.getElementById("cancelar-form").addEventListener("click", function () {
        window.location.hash = '/usuario';
        rutas();
    });

    // Asignar valores a los campos del formulario
    document.getElementById("nombre").value = dato.nombre || 'N/A'; 
    document.getElementById("contrasenia").value = dato.contrasenia || '';
    document.getElementById("ci").value = dato.DatosPersonale.ci || '';
    document.getElementById("telefono").value = dato.DatosPersonale.telefono || '';
    document.getElementById("correo").value = dato.DatosPersonale.Correo || '';
    document.getElementById("fechanacimiento").value = dato.DatosPersonale.FechaNacimiento || '';
    document.getElementById("domicilio").value = dato.DatosPersonale.Domicilio || '';
    document.getElementById("gradoacademico").value = dato.DatosAcademico.GradoAcademico || '';
    document.getElementById("areaespecializacion").value = dato.DatosAcademico.AreaEspecializacion || '';
    document.getElementById("grado").value = dato.DatosAcademico.Grado || '';
    if (dato.RoleId) {
        document.getElementById("select-roles").value = dato.RoleId;
    }

    // Manejar el envío del formulario actualizado
    document.getElementById("add-form").onsubmit = function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        fetch(`${URL_SERVER}/Usuario/actualizar/${dato.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            alert('Usuario actualizado exitosamente');
            document.getElementById("form-container").style.display = "none";
            document.getElementById("add-form").reset();
            //obtenerDatos(); // Volver a cargar los datos
            document.getElementById("view-container").style.display = "block";
            window.location.hash = '/usuario';
                rutas();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al actualizar el usuario');
        });
    };
}
function cargarRolesEnSelect(callback) {
    const selectRoles = document.getElementById('select-roles');

    fetch(`${URL_SERVER}/Roles/lista`)
        .then(response => response.json())
        .then(roles => {
            // Limpia el select antes de agregar las opciones
            selectRoles.innerHTML = '<option value="">Seleccione un rol</option>';

            // Itera sobre los roles y agrega cada uno como opción
            roles.forEach(rol => {
                let option = document.createElement('option');
                option.value = rol.id;
                option.textContent = rol.nombre;
                selectRoles.appendChild(option);
            });

            // Ejecuta el callback si se proporciona
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error al cargar los roles:', error);
        });
}
