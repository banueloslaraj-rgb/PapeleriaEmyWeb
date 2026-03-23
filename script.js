let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
    crearFiltros();
  });

function mostrarProductos(lista) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  lista.forEach(p => {
    contenedor.innerHTML += `
      <div class="producto">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.categoria}</p>
        <p>$${p.precio}</p>
        <button onclick="agregar(${p.id})">Agregar</button>
      </div>
    `;
  });
}

function crearFiltros() {
  const categorias = [...new Set(productos.map(p => p.categoria))];
  const contenedor = document.getElementById("filtros");

  categorias.forEach(cat => {
    contenedor.innerHTML += `<button onclick="filtrar('${cat}')">${cat}</button>`;
  });
}

function filtrar(categoria) {
  const filtrados = productos.filter(p => p.categoria === categoria);
  mostrarProductos(filtrados);
}

function agregar(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminar(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const totalEl = document.getElementById("total");

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    lista.innerHTML += `<li>${p.nombre} - $${p.precio} <button onclick="eliminar(${i})">❌</button></li>`;
    total += p.precio;
  });

  totalEl.innerText = "Total: $" + total;
}

function pagar() {
  window.location.href = "https://mpago.la/tu_link";
}

function enviarWhatsApp() {
  let mensaje = "Pedido:%0A";
  let total = 0;

  carrito.forEach(p => {
    mensaje += `- ${p.nombre} $${p.precio}%0A`;
    total += p.precio;
  });

  mensaje += `%0ATotal: $${total}`;

  window.open(`https://wa.me/5213111063251?text=${mensaje}`);
}

// Buscador

document.getElementById("buscador").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();
  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
});

mostrarCarrito();