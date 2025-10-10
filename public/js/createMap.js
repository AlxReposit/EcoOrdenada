//Criação do mapa com Leaflet
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Dados de coordenadas armazenados em JSON
//Buscar no servidor
const dados = [
    { descricao: 'Local A', coordenada: [51.505, -0.09] },
    { descricao: 'Local B', coordenada: [51.4, -0.09] },
    { descricao: 'Local C', coordenada: [51.3, -0.09] },
    { descricao: 'Local D', coordenada: [51.2, -0.09] }
]

//var marker = L.marker([51.5, -0.09]).addTo(map);
//marker.bindPopup("<b>Hello world!</b><br>I am a popup.");

dados.forEach(local => {
    L.marker(local.coordenada)
    .bindPopup("<b>"+local.descricao+"</b><br>"+local.coordenada)
    .addTo(map);
});

// TODO
// Busca com Nominatim

document.getElementById('')