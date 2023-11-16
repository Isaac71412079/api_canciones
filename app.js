const cancionesTable = document.getElementById('canciones-table');
const cancionesBody = document.getElementById('canciones-body');
const searchInput = document.getElementById('searchInput');
const formulario = document.getElementById('formulario');
const tituloInput = document.getElementById('tituloInput');
const generoInput = document.getElementById('generoInput');
const interpreteInput = document.getElementById('interpreteInput');
const albumInput = document.getElementById('albumInput');
const añoInput = document.getElementById('añoInput');

//CARGAR CANCIONES
async function cargarCanciones() {
  try {
    const response = await fetch('http://localhost:3000/canciones'); // Corregir aquí
    const canciones = await response.json();

    cancionesBody.innerHTML = '';

    canciones.forEach((cancion) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cancion.Titulo}</td>
        <td>${cancion.Genero}</td>
        <td>${cancion.Interprete}</td>
        <td>${cancion.Album}</td>
        <td>${cancion.Año}</td>
        <td>
          <button id="editar" onclick="editarCancion(${cancion.Id})"><img src="img/editar.png" height="35px" width="35px"></button>
          <button id="eliminar" onclick="eliminarCancion(${cancion.Id})"><img src="img/eliminar.png" height="35px" width="35px" ></button>
        </td>
      `;

      cancionesBody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar las canciones', error);
  }
}

//BUSCAR CANCIONES
// Función para buscar canciones
function buscarCanciones() {
  const term = normalizeString(searchInput.value);
  const filas = cancionesBody.querySelectorAll('tr');
  let algunaCoincidencia = false;

  filas.forEach((fila) => {
    const contenido = fila.innerText.toLowerCase();
    const contenidoNormalizado = normalizeString(contenido);

    if (contenidoNormalizado.includes(term)) {
      fila.style.display = '';
      algunaCoincidencia = true;
    } else {
      fila.style.display = 'none';
    }
  });

  // Mostrar mensaje si no se encontraron coincidencias
  if (!algunaCoincidencia) {
    mostrarMensajeNoEncontrado();
  }
}

// Función para mostrar un mensaje cuando no se encuentran canciones
function mostrarMensajeNoEncontrado() {
  const mensajeNoEncontrado = document.getElementById('mensaje-no-encontrado');

  if (!mensajeNoEncontrado) {
    const mensaje = document.createElement('p');
    mensaje.id = 'mensaje-no-encontrado'; // Corregir aquí
    mensaje.textContent = 'No se encontraron canciones.....';
    cancionesTable.appendChild(mensaje);
  }
}

// Función para normalizar una cadena de texto (quitar acentos y convertir a minúsculas)
function normalizeString(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres a Unicode
    .replace(/[\u0300-\u036f]/g, ''); // Eliminar diacríticos
}

//FORMULARIO
function mostrarFormulario() {
  formulario.style.display = 'block';
}

//AGREGAR CANCIÓN
async function agregarCancion() {
  const nuevaCancion = {
    Titulo: tituloInput.value,
    Genero: generoInput.value,
    Interprete: interpreteInput.value,
    Album: albumInput.value,
    Año: parseInt(añoInput.value),
  };

  try {
    await fetch('http://localhost:3000/canciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaCancion),
    });

    // Limpiar el formulario después de agregar la canción
    tituloInput.value = '';
    generoInput.value = '';
    interpreteInput.value = '';
    albumInput.value = '';
    añoInput.value = '';

    // Recargar las canciones para actualizar la tabla
    cargarCanciones();
  } catch (error) {
    console.error('Error al agregar la canción', error);
  }
}

//EDITAR CANCIÓN
async function editarCancion(Id) {
  // Obtener la canción a editar
  const response = await fetch(`http://localhost:3000/canciones/${Id}`);
  const cancion = await response.json();

  // Rellenar el formulario con los datos de la canción
  tituloInput.value = cancion.Titulo;
  generoInput.value = cancion.Genero;
  interpreteInput.value = cancion.Interprete;
  albumInput.value = cancion.Album;
  añoInput.value = cancion.Año;

  // Mostrar el formulario
  formulario.style.display = 'block';

  // Agregar un botón de actualización en lugar del botón de agregar
  const guardarBoton = document.createElement('button');
  guardarBoton.innerText = 'Guardar Cambios';
  guardarBoton.onclick = async () => {
    await actualizarCancion(Id);
  };

  // Reemplazar el botón original con el nuevo botón de guardar cambios
  formulario.removeChild(formulario.lastChild);
  formulario.appendChild(guardarBoton);
}

//ACTUALIZAR CANCIÓN
async function actualizarCancion(Id) {
  const cancionActualizada = {
    Titulo: tituloInput.value,
    Genero: generoInput.value,
    Interprete: interpreteInput.value,
    Album: albumInput.value,
    Año: parseInt(añoInput.value),
  };

  try {
    await fetch(`http://localhost:3000/canciones/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancionActualizada),
    });

    // Limpiar el formulario después de actualizar la canción
    tituloInput.value = '';
    generoInput.value = '';
    interpreteInput.value = '';
    albumInput.value = '';
    añoInput.value = '';

    // Recargar las canciones para actualizar la tabla
    cargarCanciones();

    // Restaurar el formulario para agregar una nueva canción
    formulario.style.display = 'none';
    const agregarBoton = document.createElement('button');
    agregarBoton.innerText = 'Añadir Canción';
    agregarBoton.onclick = mostrarFormulario;
    formulario.appendChild(agregarBoton);
  } catch (error) {
    console.error('Error al actualizar la canción', error);
  }
}

//ELIMINAR CANCIÓN
async function eliminarCancion(Id) {
  try {
    await fetch(`http://localhost:3000/canciones/${Id}`, {
      method: 'DELETE',
    });

    // Recargar las canciones para actualizar la tabla
    cargarCanciones();
  } catch (error) {
    console.error('Error al eliminar la canción', error);
  }
}

cargarCanciones();

//REFRESCAR HOJA
let refresh = document.getElementById('refresh');
refresh.addEventListener('click', _ => {
            location.reload();
})