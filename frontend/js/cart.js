const productosCart = document.getElementById("productosCart");
const metodoPagoSelect = document.getElementById('metodoPago');
const metodoPagoTarjeta = document.getElementById('metodoPagoTarjeta');
const metodoPagoTransferencia = document.getElementById('metodoPagoTransferencia');
const textoMetodo = document.getElementById('metodoDePago')

// Funcion que genera el carrito en base al array del carrito en localStorage

function renderCart() {
    const storedInfo = localStorage.getItem('productInfo');
    const savedInfoArray = JSON.parse(storedInfo);
    const longitud = savedInfoArray.length
    const contenidoCart = document.getElementById("contenidoCart");
    const alertaCarritoVacio = document.getElementById("alertaCarritoVacio");
    if (longitud === 0) {
        contenidoCart.style.display = "none";
        alertaCarritoVacio.style.display = "block";
    } else {
        contenidoCart.style.display = "block";
        alertaCarritoVacio.style.display = "none";
    };
    let html = '';
    savedInfoArray.forEach((item, index) => {
        const cantidad = item.cartCount;
        const costo = item.cost;
        const subtotal = cantidad * costo;
        html += `
            <tr>
                <td class="d-none d-md-table-cell"><img src="${item.images[0]}" style="width: 100px;"></td>
                <td><span class="nombre">${item.name}</span></td>
                <td class="d-none d-md-table-cell"><span class="subtotal">${costo} ${item.currency}</span></td>
                <td><input type="number" class="cantidad-input" data-index="${index}" style="width: 70px;" value="${cantidad}" min="1" max="10"></td>
                <td><span class="subtotal-td" data-subtotal="${subtotal} ${item.currency}">${subtotal} ${item.currency}</span></td>
                <td><button class="btn btn-danger eliminar-btn" data-index="${index}">╳</button></td>
            </tr>
        `;
    });
    productosCart.innerHTML = html;
    const cantidadInputs = document.querySelectorAll('.cantidad-input');
    cantidadInputs.forEach(input => {
        input.addEventListener('input', () => {
            actualizarCantProducto(input, savedInfoArray);
        });
    });
    const eliminarButtons = document.querySelectorAll('.eliminar-btn');
    eliminarButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            savedInfoArray.splice(index, 1);
            actualizarLocalStorage(savedInfoArray);
            renderCart();
        });
    });
}

// Actualizar cantidad de un producto en el carrito y el subtotal en la linea del carrito

function actualizarCantProducto(input, savedInfoArray) {
    const index = input.getAttribute('data-index');
    const cantidad = parseInt(input.value);
    const item = savedInfoArray[index];
    const costo = item.cost;
    const subtotalElement = input.parentElement.nextElementSibling.querySelector('.subtotal-td');
    const subtotal = cantidad * costo;
    subtotalElement.textContent = `${subtotal} ${item.currency}`;
    item.cartCount = cantidad;
    actualizarLocalStorage(savedInfoArray);
    costos();
    containerCostos()
}

function actualizarLocalStorage(array) {
    localStorage.setItem('productInfo', JSON.stringify(array));
}

// Calculo de subtotal / costo de envio / total de la compra
let productos = JSON.parse(localStorage.getItem('productInfo'));
let subtotal = 0;
let costoEnvio = 0;
let porcentajeCostoEnvio = 0;

let opcionPremium = document.getElementById('opcionPremium');
let opcionExpress = document.getElementById('opcionExpress');
let opcionStandard = document.getElementById('opcionStandard');
let containerSubtotal = document.getElementById('containerSubtotal');
let containerEnvio = document.getElementById('containerEnvio');
let containerTotal = document.getElementById('containerTotal');

opcionPremium.addEventListener('click', function () {
    porcentajeCostoEnvio = 0.15;
    containerCostos();
});
opcionExpress.addEventListener('click', function () {
    porcentajeCostoEnvio = 0.07;
    containerCostos();
});
opcionStandard.addEventListener('click', function () {
    porcentajeCostoEnvio = 0.05;
    containerCostos();
});

// funcion costos calcula el subtotal de la compra
function costos() {
    productos = JSON.parse(localStorage.getItem('productInfo'));
    subtotal = 0;
    productos.forEach(producto => {
        if (producto.currency == 'USD') {
            subtotal += producto.cost * producto.cartCount;
        } else {
            subtotal += Math.round(producto.cost / 40) * producto.cartCount;
        }
        containerSubtotal.innerHTML = `USD ${subtotal}`;
    });
}

// Funcion que actualiza el valor del costo de envio y el total de compra
function containerCostos() {
    costoEnvio = Math.round(subtotal * porcentajeCostoEnvio);
    containerEnvio.innerHTML = `USD ${costoEnvio}`;
    containerTotal.innerHTML = `USD ${subtotal + costoEnvio}`;
}
// Se genera el carrito y se calcula el subtotal
renderCart();
costos();

// Funcionalidad del select para Metodo de Pago
metodoPagoSelect.addEventListener('change', function () {
    const selectedOption = metodoPagoSelect.value;
    // Oculta todos los divs
    metodoPagoTarjeta.style.display = 'none';
    metodoPagoTransferencia.style.display = 'none';
    // Muestra el div correspondiente al método de pago seleccionado
    if (selectedOption === '1') {
        metodoPagoTarjeta.style.display = 'block';
        textoMetodo.innerText = 'Tarjeta de crédito';
    } else if (selectedOption === '2') {
        metodoPagoTransferencia.style.display = 'block';
        textoMetodo.innerText = 'Transferencia bancaria';
    } else if (selectedOption === '0') {
        textoMetodo.innerText = 'Metodo de pago'
    }
});

//Se agrega funcionalidad para codigo de tarjeta menor a 3 caracteres y número de tarjeta igula a 16 números.

document.getElementById("codigoSeg").addEventListener("input", function () {
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3); // Limitar a 16 caracteres
    }
})
document.getElementById("numeroTarjeta").addEventListener("input", function () {
    if (this.value.length > 16) {
        this.value = this.value.slice(0, 16); // Limitar a 16 caracteres
    }
});
// Funcion para reescribir input de MM/AA de la fecha de vencimiento
const input = document.getElementById('vencimiento');
input.addEventListener("input", () => {
    let value = input.value.replace(/\D/g, ""); // Elimina todos los caracteres que no sean dígitos
    if (value.length > 2) {
        value = value.substring(0, 2) + "/" + value.substring(2); // Agrega una barra después de los primeros dos dígitos
    }
    input.value = value;
});

// Finalizar Compra - funcionalidad de boton y validacion de formulario

const finalizarCompraBoton = document.getElementById('finalizarCompraBoton');

finalizarCompraBoton.addEventListener('click', function () {
    const calleInput = document.getElementById('calle');
    const numeroInput = document.getElementById('numero');
    const esquinaInput = document.getElementById('esquina');
    const formaEnvioInputs = document.querySelectorAll('input[name="opcion"]');
    const FormaPago = document.getElementById('metodoPago');
    let formaEnvioSeleccionada = false;
    formaEnvioInputs.forEach(input => {
        if (input.checked) {
            formaEnvioSeleccionada = true;
        }
    });
    const cantidadInputs = document.querySelectorAll('.cantidad-input');
    let cantidadValida = false;
    cantidadInputs.forEach(input => {
        if (parseInt(input.value) > 0) {
            cantidadValida = true;
        }
    });
    if (!cantidadValida) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'La cantidad de productos en el carrito debe ser mayor a 0.',
            icon: 'error',
        });
    } else if (!formaEnvioSeleccionada) {
        Swal.fire({
            title: 'Forma de envío no seleccionada',
            text: 'Debes seleccionar una forma de envío.',
            icon: 'error',
        });
    } else if (calleInput.value.trim() === '' || numeroInput.value.trim() === '' || esquinaInput.value.trim() === '') {
        Swal.fire({
            title: 'Campos vacíos',
            text: 'Los campos de dirección no pueden estar vacíos.',
            icon: 'error',
        });
    } else if ((FormaPago.value == 0 || FormaPago.value == "")) {
        Swal.fire({
            title: 'Forma de pago no seleccionada',
            text: 'Debes seleccionar una forma de pago.',
            icon: 'error',
        });
    } else if (FormaPago.value == 1) {
        const numeroTarjetaInput = document.getElementById('numeroTarjeta');
        const codigoSegInput = document.getElementById('codigoSeg');
        const vencimientoInput = document.getElementById('vencimiento');
        if (numeroTarjetaInput.value.trim() === '' || codigoSegInput.value.trim() === '' || vencimientoInput.value.trim() === '') {
            Swal.fire({
                title: 'Campos de tarjeta de crédito vacíos',
                text: 'Debes completar los campos de tarjeta de crédito.',
                icon: 'error',
            });
        } else {
            Swal.fire({
                title: 'Compra exitosa',
                text: '¡Gracias por tu compra!',
                icon: 'success',
            });
            cargarPDF()
        }
    } else if (FormaPago.value == 2) {
        const numeroCuentaInput = document.getElementById('numeroCuenta');
        if (numeroCuentaInput.value.trim() === '') {
            Swal.fire({
                title: 'Número de cuenta no proporcionado',
                text: 'Debes completar el campo de número de cuenta para transferencia bancaria.',
                icon: 'error',
            });
        } else {
            Swal.fire({
                title: 'Compra exitosa',
                text: '¡Gracias por tu compra!',
                icon: 'success',
            });
            cargarPDF()
        }
    }
});

// Función para generar el PDF
function cargarPDF() {
    const storedInfo = localStorage.getItem('productInfo');
    const savedInfoArray = JSON.parse(storedInfo);
    const calleInput = document.getElementById('calle');
    const numeroInput = document.getElementById('numero');
    const esquinaInput = document.getElementById('esquina');
    const metodoDePago = document.getElementById("metodoDePago").textContent;
    // Calcular el subtotal y otros valores
    let subtotal = 0;
    savedInfoArray.forEach(item => {
        subtotal += item.cost * item.cartCount;
    });
    const costoEnvio = Math.round(subtotal * porcentajeCostoEnvio);
    const totalCompra = subtotal + costoEnvio;
    var docDefinition = {
        content: [
            { text: 'Factura', style: 'subheader', alignment: 'center' },
            { text: ' ', margin: [0, 10] },
            { text: 'Productos:', style: 'subheader' },
        ],
        styles: {
            subheader: {
                fontSize: 16,
                bold: true
            }
        }
    };
    // Agregar los productos
    savedInfoArray.forEach(function (item) {
        if (item.name) {
            docDefinition.content.push(
                `${item.name}     ${item.cost}   X   ${item.cartCount}  =  ${item.currency} ${item.cartCount * item.cost}`
            );
        };
    });
    docDefinition.content.push(
        { text: ' ', margin: [0, 10] }, // Espacio entre los productos y otros datos
        `Subtotal de la compra: USD ${subtotal}`,
        `Costo de envío: USD ${costoEnvio}`,
        `Valor total: USD ${totalCompra}`
    );
    docDefinition.content.push(
        { text: ' ', margin: [0, 10] }, // Espacio entre los productos y otros datos
        `Método de pago seleccionado: ${metodoDePago}`,
        `Dirección de Envío: Calle: ${calleInput.value}, Esq: ${esquinaInput.value}, Num: ${numeroInput.value}.`
    );
    // Generar el PDF y mostrarlo en una nueva pestaña
    var pdfDoc = pdfMake.createPdf(docDefinition);
    setTimeout(() => {
        pdfDoc.open(); //.download(Factura.pdf)
    }, 2000);
};
