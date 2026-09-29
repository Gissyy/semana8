const pedidoGuardado = sessionStorage.getItem("pedido");

if (pedidoGuardado === null) {
	document.getElementById("contenidoPedido").classList.add("d-none");

	document.getElementById("sinPedido").classList.remove("d-none");
} else {
	const pedido = JSON.parse(pedidoGuardado);

	// Datos del cliente

	document.getElementById("nombre").textContent = pedido.nombre;

	document.getElementById("correo").textContent = pedido.correo;

	document.getElementById("fecha").textContent = pedido.fecha;

	if (pedido.modalidad === "reparto") {
		document.getElementById("modalidad").textContent = "Reparto";
	} else {
		document.getElementById("modalidad").textContent = "Retiro en tienda";
	}

	// Productos

	const tablaProductos = document.getElementById("productos");

	pedido.productos.forEach((producto) => {
		const fila = document.createElement("tr");

		const importe = producto.precio * producto.cantidad;

		fila.innerHTML = `
            <td>${producto.nombre}</td>

            <td>
                ${producto.cantidad}
            </td>

            <td>
                S/ ${producto.precio.toFixed(2)}
            </td>

            <td>
                S/ ${importe.toFixed(2)}
            </td>
        `;

		tablaProductos.appendChild(fila);
	});

	// Montos

	document.getElementById("subtotal").textContent =
		pedido.subtotal.toFixed(2);

	document.getElementById("descuento").textContent =
		pedido.descuento.toFixed(2);

	document.getElementById("reparto").textContent = pedido.reparto.toFixed(2);

	document.getElementById("total").textContent = pedido.total.toFixed(2);
}
