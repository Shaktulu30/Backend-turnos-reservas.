const socket = io();

socket.on("nuevoServicio", (service) => {
  const list = document.getElementById("services-list");
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${service.name}</h2>
    <p>${service.description}</p>
    <p class="muted">
      Duración: ${service.duration} min ·
      Precio: $${service.price} ·
      Categoría: ${service.category} ·
      Disponible: ${service.available}
    </p>
  `;
  list.appendChild(card);
});