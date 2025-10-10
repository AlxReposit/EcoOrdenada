// Inicializa o mapa
const map = L.map('map').setView([-23.5505, -46.6333], 12); // Centro: São Paulo

// Camada base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcadores de exemplo
const ecopontos = [
  { nome: "Ecoponto Vila Mariana", tipo: "Recicláveis", lat: -23.588, lon: -46.633 },
  { nome: "Coleta de Eletrônicos Paulista", tipo: "Eletrônicos", lat: -23.561, lon: -46.655 },
  { nome: "Ponto de Pilhas Pinheiros", tipo: "Pilhas e Baterias", lat: -23.566, lon: -46.701 }
];

// Adiciona marcadores no mapa
ecopontos.forEach(ponto => {
  L.marker([ponto.lat, ponto.lon])
    .addTo(map)
    .bindPopup(`<strong>${ponto.nome}</strong><br>${ponto.tipo}`);
});

// Busca simples (usando Nominatim)
document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const results = await response.json();

  if (results.length > 0) {
    const { lat, lon } = results[0];
    map.setView([lat, lon], 14);
    L.marker([lat, lon]).addTo(map)
      .bindPopup(`Busca: ${query}`).openPopup();
  } else {
    alert("Local não encontrado!");
  }
});
