const catalogo = [
	{
		id: 1,
		nombre: "Pan de masa madre",
		precio: 18,
	},
	{
		id: 2,
		nombre: "Caja de alfajores",
		precio: 24,
	},
	{
		id: 3,
		nombre: "Torta pequeña",
		precio: 45,
	},
];

const listaProductos = document.getElementById("listaProductos");
const formPedido = document.getElementById("formPedido");

const subtotalTexto = document.getElementById("subtotal");
const descuentoTexto = document.getElementById("descuento");
const repartoTexto = document.getElementById("costoReparto");
const totalTexto = document.getElementById("total");

// ==========================
// FECHA MÍNIMA
// ==========================

const hoy = new Date().toISOString().split("T")[0];

document.getElementById("fecha").min = hoy;

// ==========================
// MOSTRAR PRODUCTOS
// ==========================

function mostrarProductos() {
	catalogo.forEach((producto) => {
		const fila = document.createElement("div");

		fila.className = "border rounded p-3 mb-2";

		fila.innerHTML = `
            <div class="row align-items-center">

                <div class="col-12 col-md-6">

                    <div class="form-check">

                        <input
                            class="form-check-input producto-check"
                            type="checkbox"
                            id="producto-${producto.id}"
                            data-id="${producto.id}"
                        >

                        <label
                            class="form-check-label"
                            for="producto-${producto.id}"
                        >
                            ${producto.nombre}
                            - S/ ${producto.precio.toFixed(2)}
                        </label>

                    </div>

                </div>

                <div class="col-12 col-md-6 mt-2 mt-md-0">

                    <input
                        type="number"
                        class="form-control cantidad"
                        id="cantidad-${producto.id}"
                        min="1"
                        max="10"
                        step="1"
                        placeholder="Cantidad"
                        disabled
                    >

                </div>

            </div>
        `;

		listaProductos.appendChild(fila);
	});
}

mostrarProductos();

// ==========================
// LEER PRODUCTOS
// ==========================

function obtenerProductosSeleccionados() {
	const seleccionados = [];

	catalogo.forEach((producto) => {
		const check = document.getElementById(`producto-${producto.id}`);

		const cantidadInput = document.getElementById(
			`cantidad-${producto.id}`,
		);

		if (check.checked) {
			const cantidad = Number(cantidadInput.value);

			seleccionados.push({
				id: producto.id,
				nombre: producto.nombre,
				precio: producto.precio,
				cantidad: cantidad,
			});
		}
	});

	return seleccionados;
}

// ==========================
// CÁLCULOS
// ==========================

function calcularSubtotal(productos) {
	let subtotal = 0;

	productos.forEach((producto) => {
		if (
			Number.isInteger(producto.cantidad) &&
			producto.cantidad >= 1 &&
			producto.cantidad <= 10
		) {
			subtotal += producto.precio * producto.cantidad;
		}
	});

	return subtotal;
}

function calcularDescuento(subtotal) {
	if (subtotal >= 100) {
		return subtotal * 0.1;
	}

	return 0;
}

function calcularReparto() {
	const modalidad = document.querySelector(
		'input[name="modalidad"]:checked',
	).value;

	if (modalidad === "reparto") {
		return 8;
	}

	return 0;
}

function calcularTotal(subtotal, descuento, reparto) {
	return subtotal - descuento + reparto;
}

// ==========================
// ACTUALIZAR RESUMEN
// ==========================

function actualizarResumen() {
	const productos = obtenerProductosSeleccionados();

	const subtotal = calcularSubtotal(productos);

	const descuento = calcularDescuento(subtotal);

	const reparto = calcularReparto();

	const total = calcularTotal(subtotal, descuento, reparto);

	subtotalTexto.textContent = subtotal.toFixed(2);

	descuentoTexto.textContent = descuento.toFixed(2);

	repartoTexto.textContent = reparto.toFixed(2);

	totalTexto.textContent = total.toFixed(2);
}

// ==========================
// ACTIVAR CANTIDADES
// ==========================

document.querySelectorAll(".producto-check").forEach((check) => {
	check.addEventListener("change", function () {
		const id = this.dataset.id;

		const cantidad = document.getElementById(`cantidad-${id}`);

		if (this.checked) {
			cantidad.disabled = false;

			if (cantidad.value === "") {
				cantidad.value = 1;
			}
		} else {
			cantidad.disabled = true;
			cantidad.value = "";
		}

		actualizarResumen();
	});
});

// ==========================
// ACTUALIZAR AL CAMBIAR
// CANTIDADES
// ==========================

document.querySelectorAll(".cantidad").forEach((input) => {
	input.addEventListener("input", actualizarResumen);
});

// ==========================
// ACTUALIZAR AL CAMBIAR
// MODALIDAD
// ==========================

document.querySelectorAll('input[name="modalidad"]').forEach((radio) => {
	radio.addEventListener("change", actualizarResumen);
});

// ==========================
// VALIDACIÓN
// ==========================

function validarFormulario(productos) {
	let valido = true;

	const nombre = document.getElementById("nombre").value.trim();

	const correo = document.getElementById("correo").value.trim();

	const fecha = document.getElementById("fecha").value;

	const errorNombre = document.getElementById("errorNombre");

	const errorCorreo = document.getElementById("errorCorreo");

	const errorFecha = document.getElementById("errorFecha");

	const errorProductos = document.getElementById("errorProductos");

	errorNombre.textContent = "";
	errorCorreo.textContent = "";
	errorFecha.textContent = "";
	errorProductos.textContent = "";

	// Nombre
	if (nombre.length < 3 || nombre.length > 60) {
		errorNombre.textContent =
			"El nombre debe tener entre 3 y 60 caracteres.";

		valido = false;
	}

	// Correo
	if (!correo.includes("@") || !correo.includes(".")) {
		errorCorreo.textContent = "Ingrese un correo válido.";

		valido = false;
	}

	// Fecha
	if (fecha === "" || fecha < hoy) {
		errorFecha.textContent = "La fecha no puede ser anterior a hoy.";

		valido = false;
	}

	// Al menos un producto
	if (productos.length === 0) {
		errorProductos.textContent = "Seleccione al menos un producto.";

		valido = false;
	} else {
		for (const producto of productos) {
			if (
				!Number.isInteger(producto.cantidad) ||
				producto.cantidad < 1 ||
				producto.cantidad > 10
			) {
				errorProductos.textContent =
					"Las cantidades deben ser números enteros entre 1 y 10.";

				valido = false;

				break;
			}
		}
	}

	return valido;
}

// ==========================
// ENVIAR FORMULARIO
// ==========================

formPedido.addEventListener("submit", function (event) {
	event.preventDefault();

	const productos = obtenerProductosSeleccionados();

	if (!validarFormulario(productos)) {
		return;
	}

	const nombre = document.getElementById("nombre").value.trim();

	const correo = document.getElementById("correo").value.trim();

	const fecha = document.getElementById("fecha").value;

	const modalidad = document.querySelector(
		'input[name="modalidad"]:checked',
	).value;

	const subtotal = calcularSubtotal(productos);

	const descuento = calcularDescuento(subtotal);

	const reparto = calcularReparto();

	const total = calcularTotal(subtotal, descuento, reparto);

	const pedido = {
		nombre,
		correo,
		fecha,
		modalidad,
		productos,
		subtotal,
		descuento,
		reparto,
		total,
	};

	sessionStorage.setItem("pedido", JSON.stringify(pedido));

	window.location.href = "resumen-pedido.html";
});
