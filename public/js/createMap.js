//Criação do mapa com Leaflet
var map = L.map('map').setView([-23.3151, -47.2591], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Adicionar botão personalizado ao mapa para fazer a busca com base no estado atual do mapa
L.Control.btnBuscaBox = L.Control.extend({
    onAdd: function (map) {
        var btn = L.DomUtil.create('button', 'btn');
        btn.id = 'btnBuscaBox';
        btn.classList.add('btn-light', 'border');
        btn.innerHTML = 'Buscar no Mapa';

        L.DomEvent.on(btn, 'click', async () => {
            //testeBoundingBox();
            const dados = await buscarBoxMapa();
            carregarMarcadores(dados);
        });

        return btn;
    },

    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.btnBuscaBox = function (opts) {
    return new L.Control.btnBuscaBox(opts);
}

L.control.btnBuscaBox({ position: 'bottomleft' }).addTo(map);

/*
const dados = [
    { descricao: 'Local A', coordenada: [51.505, -0.09] },
    { descricao: 'Local B', coordenada: [51.4, -0.09] },
    { descricao: 'Local C', coordenada: [51.3, -0.09] },
    { descricao: 'Local D', coordenada: [51.2, -0.09] }
]*/

//var marker = L.marker([51.5, -0.09]).addTo(map);
//marker.bindPopup("<b>Hello world!</b><br>I am a popup.");

//variáavel para controle de marcadores ativos no mapa
let marcadores = [];

//Envia as informações digitadas pelo usuário para realizar a busca nas APIs
document.getElementById('formBusca').addEventListener('submit', async (e) => {
    e.preventDefault();

    //Query para busca
    const query = document.getElementById('inputBusca').value;
    if (query == "" || !query || query.trim() == "") {
        return;
    }

    const distancia = document.getElementById('inputDistancia').value;

    const dadosNominatim = await buscarLocalNominatim(query);
    const dadosOverpass = await buscarLocaisDistancia(dadosNominatim[0].lat, dadosNominatim[0].lon, distancia)
    carregarMarcadores(dadosOverpass);
});

//Remove marcadores do mapa
function removerMarcadores() {
    marcadores.forEach(marcador => {
        map.removeLayer(marcador);
    });
}

//Carrega os marcadores no mapa conforme dados recebidos
function carregarMarcadores(locais) {

    if (locais == null || locais == undefined || locais == '') {
        alert("Não foram encontrados locais de reciclagem próximos. Por favor, tente aumentar a distância da pesquisa.");
        return;
    }

    removerMarcadores();
    const listaMarcadores = document.getElementById('listaMarcadores');
    listaMarcadores.innerHTML = '';

    locais.forEach(local => {
        //Ajustar descrições para facilitar leitura
        const tipo = (local.tipo == 'centre') ? 'Centro de Coleta de Recicláveis' : 'Container de Lixo Reciclável';

        //Acrescentar marcador no mapa
        const marcador = L.marker([local.lat, local.lon])
            .bindPopup(`
                <b>${tipo}</b>
                <br>${local.nome}<br>
                <a href="https://www.google.com/maps/?q=${local.lat},${local.lon}" target="_blank">Google Maps</a>
                `)
            .addTo(map);
        marcadores.push(marcador);

        //Acrescentar local na lista lateral
        const itemLista = document.createElement('li');
        itemLista.classList.add('list-group-item', 'list-group-item-action');
        itemLista.innerHTML = `<p class="mb-2 fw-bold">${tipo} - ${local.nome}</p>
                        <p class="small"><a href="https://www.google.com/maps/?q=${local.lat},${local.lon}" target="_blank">Abrir no Google Maps</a></p>`;
        itemLista.addEventListener('click', () => {
            map.setView([local.lat, local.lon], 15);
            marcador.openPopup();
        })
        listaMarcadores.appendChild(itemLista);
    });

    //map.setView([locais[0].lat, locais[0].lon], 13);
    //listaMarcadores.firstChild.classList.add('active');
}

//FUnção para pesquisar o local que o usuário informou no formulário e retornar a latitude e longitude, para ser usados na busca com Overpass
async function buscarLocalNominatim(query) {
    //Chamando API Nominatim
    //Tem o objetivo de encontrar as coordenadas do local que o usuário quer pesquisar, usando como "ponto central"
    //"https://nominatim.openstreetmap.org/search?q="+query+"&limit=2&format=json"
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&limit=1&format=json`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na chamada da API Nominatim: ${response.status}`);
        }

        const result = await response.json();
        //console.log(JSON.stringify(result));

        return result.map(local => ({
            id: local.osm_id,
            lat: local.lat,
            lon: local.lon,
        }));

    } catch (error) {
        console.log(error);
    }
}

//Função para enviar a busca de dados com base no local encontrado pelo Nominatim e da distância segundo informações do formulário
async function buscarLocaisDistancia(lat, lon, distanciaBusca) {
    map.setView([lat, lon], 13);

    if (distanciaBusca == null) {
        distanciaBusca = 5000;
    }
    //const distanciaBusca = 3000;
    //const lat = -23.519127;
    //const lon = -46.641321;

    const busca = `
    [out:json];
    node(around:${distanciaBusca}, ${lat}, ${lon})[amenity=recycling];
    out;
    `;

    const buscaId = `
    [out:json][timeout:250];
    // gather results
    node(id:9044572970, {{bbox}});
    // print results
    out;
    `;

    const buscaLixeira = `
    [out:json][timeout:25];
    (
      node(around:${distanciaBusca}, ${lat}, ${lon})["amenity"="waste_basket"];
      node(around:${distanciaBusca}, ${lat}, ${lon})["amenity"="waste_disposal"];
    );
    out geom;
    `;

    /*
    https://overpass-turbo.eu/#
    https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL
    https://wiki.openstreetmap.org/wiki/Map_features#Waste_Management
    amenity 	recycling 	node area 	Recycling facilities (bottle banks, etc.). Combine with recycling_type=container for containers or recycling_type=centre for recycling centres. 	
    amenity 	waste_basket 	node 	A single small container for depositing garbage that is easily accessible for pedestrians. 	
    amenity 	waste_disposal 	node 	A medium or large disposal bin, typically for bagged up household or industrial waste. 	
    amenity 	waste_transfer_station 	node area 	A waste transfer station is a location that accepts, consolidates and transfers waste in bulk. 
    */

    const dados = await buscarApiOverpass(busca);
    return dados;
}

//Função para enviar a busca de dados dentro dos limites do mapa (que o usuário está vendo)
async function buscarBoxMapa() {
    //Limita a distância de pesquisa pelo zoom
    if (map.getZoom() < 10) {
        alert('Aproxime o mapa para pesquisar!');
        return;
    }

    const url = "https://overpass-api.de/api/interpreter";

    const latS = map.getBounds().getSouth();
    const lonW = map.getBounds().getWest();
    const latN = map.getBounds().getNorth();
    const lonE = map.getBounds().getEast();

    const busca = `
    [out:json];
    node(${latS}, ${lonW}, ${latN}, ${lonE})[amenity=recycling];
    out;
    `;

    return await buscarApiOverpass(busca);
}

//FUnção para buscar dados na API Overpass da OpenStreetMap e e retornar os dados mapeados
async function buscarApiOverpass(query) {
    //utilizar com Overpass API
    const url = "https://overpass-api.de/api/interpreter";

    try {
        const resposta = await fetch(url, {
            method: "POST",
            body: query
        });

        if (!resposta.ok) {
            throw new Error(`Erro na chamada da API Overpass: ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (dados.elements == '') {
            return null;
        }

        return dados.elements.map(local => ({
            id: local.id,
            lat: local.lat,
            lon: local.lon,
            nome: local.tags.name || "Local sem nome",
            tipo: local.tags.recycling_type || "Desconchecido",
            tags: local.tags
        }));

    } catch (error) {
        console.log(error);
    }
}


//FUnções para teste - apagar depois

function testeBoundingBox() {

    const latS = map.getBounds().getSouth();
    const lonW = map.getBounds().getWest();
    const latN = map.getBounds().getNorth();
    const lonE = map.getBounds().getEast();

    console.log(`lat South: ${latS}`)
    console.log(`lon West: ${lonW}`)
    console.log(`lat North: ${latN}`)
    console.log(`lon East: ${lonE}`)

    console.log(`N - S: ${latN - latS}`)
    console.log(`E - W: ${lonE - lonW}`)

    console.log(`zoom: ${map.getZoom()}`)



    if (map.getZoom() < 10) {
        alert('Aproxime o mapa para pesquisar!')
    }


}

function mapearDados(dados) {
    //Padronizazr dados
    return dados.elements.map(local => ({
        id: local.id,
        lat: local.lat,
        lon: local.lon,
        nome: local.tags.name || "Local sem nome",
        tipo: local.tags.recycling_type || "Desconchecido",
        tags: local.tags
    }));
}