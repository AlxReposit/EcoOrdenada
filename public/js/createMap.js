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
        .bindPopup("<b>" + local.descricao + "</b><br>" + local.coordenada)
        .addTo(map);
});

// TODO
// Busca com Nominatim

document.getElementById('formBusca').addEventListener('submit', async (e) => {
    e.preventDefault();

    //Query para busca
    const query = document.getElementById('inputBusca').value;
    if (query == "" || !query || query.trim() == "") {
        return;
    }

    //Chamando API Nominatim
    //"https://nominatim.openstreetmap.org/search?q="+query+"&limit=2&format=json"
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&limit=3&format=json`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na chamada da API: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        result.forEach(location => {
            L.marker([location.lat, location.lon])
                .bindPopup("<b>" + location.name + "</b><br>" + location.display_name)
                .addTo(map);
        });

        map.setView([result[0].lat, result[0].lon], 13);

    } catch (error) {
        console.log(error);
    }
});