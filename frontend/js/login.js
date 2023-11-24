function borrarDatosPerfil() {
    const email = localStorage.getItem("username");

    // Hacer una solicitud al servidor para obtener los datos del perfil
    fetch(`http://localhost:3000/details/${email}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los datos del perfil: ${response.statusText}`);
            }
            return response.json();
        })
        .then(datosDesdeServidor => {
            // Actualizar los datos locales con los datos del servidor
            const datos = {
                nombre: datosDesdeServidor.nombre || "",
                segundoNombre: datosDesdeServidor.segundoNombre || "",
                apellido: datosDesdeServidor.apellido || "",
                segundoApellido: datosDesdeServidor.segundoApellido || "",
                email: datosDesdeServidor.email || email,
                telefono: datosDesdeServidor.telefono || "",
                imagenURL: datosDesdeServidor.imagenURL || "https://cdn.drawception.com/images/panels/2017/12-27/sKB3FyFYpX-2.png",
            };

            localStorage.setItem("datosGuardados", JSON.stringify(datos));
        })
        .catch(error => {
            console.error('Error al obtener los datos del perfil:', error);
        });
}

// Cambia el evento a 'submit' y pasa una referencia a la función en lugar de llamarla directamente
document.addEventListener('submit', borrarDatosPerfil);

function verificarAutenticacion() {
    var logueado = localStorage.getItem("logueado");
    var aviso = document.getElementById("p");
    var botonIn = document.getElementById("regBtn");
    var botonOut = document.getElementById("outBtn");
    var eliminar = document.getElementById("eliminar");

    if (logueado === "true") {
        console.log("El usuario está autenticado.");
        aviso.textContent = "Te encuentras logueado actualmente.";
        botonIn?.parentNode?.removeChild(botonIn);
        eliminar.textContent = "";
    } else {
        console.log("El usuario no está autenticado.");
        aviso.textContent = "Debes loguearte para acceder a la pagina.";
        botonOut?.parentNode?.removeChild(botonOut);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    verificarAutenticacion();
});

function mostrarMensaje(mensaje, exito) {
    var cartelPasa = document.getElementById('cartelYes');
    var cartelNoPasa = document.getElementById('cartelNo');
    var cartel = exito ? cartelPasa : cartelNoPasa;
    var otroCartel = exito ? cartelNoPasa : cartelPasa;

    cartel.textContent = mensaje;
    cartel.style.display = 'block';
    otroCartel.style.display = 'none';
}

function exito() {
    mostrarMensaje('Inicio de sesión realizado correctamente', false);
}

function noExito() {
    mostrarMensaje('Debe rellenar todos los campos', true);
}

function noExito2() {
    mostrarMensaje('El correo debe incluir @', true);
}

function registrarUsuario() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var aviso = document.getElementById("p");

    switch (true) {
        case username === "" && password === "":
            noExito();
            break;
        case username.includes("@"):
            if (username !== "" && password !== "") {
                localStorage.setItem("username", username);
                localStorage.setItem("logueado", "true");
                aviso.textContent = "Aguarde un momento...";
                exito();
                setTimeout(irAlIndex, 3000);
            } else {
                noExito();
            }
            break;
        case username !== "" && !username.includes("@"):
            noExito2();
            break;
    }
}

function irAlIndex() {
    window.location.href = "index.html";
}

function logout() {
    localStorage.setItem("logueado", "false");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    var regBtn = document.getElementById("regBtn");
    if (regBtn) {
        regBtn.addEventListener("click", registrarUsuario);
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        registrarUsuario();
    }
});
