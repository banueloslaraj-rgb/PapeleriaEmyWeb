let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("productos.json")
.then(r => r.json())
.then(data => {
  productos = data;
  mostrarProductos(productos);
  crearFiltros();
});

function mostrarProductos(lista){
  const cont = document.getElementById("productos");
  cont.innerHTML = "";

  lista.forEach(p => {
    cont.innerHTML += `
    <div class="producto">
      <img src="${p.imagen}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <button onclick="agregar(${p.id})">Agregar</button>
    </div>`;
  });
}

function crearFiltros(){
  const cats = [...new Set(productos.map(p => p.categoria))];
  const cont = document.getElementById("filtros");

  cats.forEach(c => {
    cont.innerHTML += `<button onclick="filtrar('${c}')">${c}</button>`;
  });
}

function filtrar(c){
  mostrarProductos(productos.filter(p => p.categoria === c));
}

function agregar(id){
  const prod = productos.find(p => p.id === id);
  const existe = carrito.find(p => p.id === id);

  if(existe){
    existe.cantidad++;
  } else {
    carrito.push({...prod, cantidad: 1});
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function cambiarCantidad(i, delta){
  carrito[i].cantidad += delta;

  if(carrito[i].cantidad <= 0){
    carrito.splice(i, 1);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function mostrarCarrito(){
  const lista = document.getElementById("listaCarrito");
  const totalEl = document.getElementById("total");

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((p, i) => {
    total += p.precio * p.cantidad;

    lista.innerHTML += `
      <li>
        ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}
        <button onclick="cambiarCantidad(${i},1)">+</button>
        <button onclick="cambiarCantidad(${i},-1)">-</button>
      </li>
    `;
  });

  totalEl.innerText = "Total: $" + total;
}

function generarTicket(){
  let html = "";
  let total = 0;

  carrito.forEach(p => {
    html += `<p>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</p>`;
    total += p.precio * p.cantidad;
  });

  html += `<h3>Total: $${total}</h3>`;
  document.getElementById("ticket").innerHTML = html;
}

function pagar(){
  generarTicket();
  document.getElementById("ticketModal").classList.remove("hidden");
}

function cerrarModal(){
  document.getElementById("ticketModal").classList.add("hidden");
}

function enviarWhatsApp(){
  let msg = "Pedido:%0A";
  let total = 0;

  carrito.forEach(p => {
    msg += `${p.nombre} x${p.cantidad} $${p.precio * p.cantidad}%0A`;
    total += p.precio * p.cantidad;
  });

  msg += `Total: $${total}`;

  window.open(`https://wa.me/5213111063251?text=${msg}`);
}

// buscador
document.getElementById("buscador").addEventListener("input", e => {
  const t = e.target.value.toLowerCase();
  mostrarProductos(productos.filter(p =>
    p.nombre.toLowerCase().includes(t)
  ));
});

mostrarCarrito();