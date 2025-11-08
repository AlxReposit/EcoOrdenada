//Modelo de dados do mongoose
const mongoose = require('mongoose')

const ecoordenadaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    endereco: {
        type: String,
        required: false
    },
    osm_amenity: {
        type: String,
        required: false
    },
    localizacao: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordenadas: { //Em GeoJSON, é primeiro lon depois lat
            type: [Number],
            required: true
        }
    }
})

/* Tipo de dado para Latitude e longitude:

lat: Decimal(8,6) => ##.######
lon: Decimal(9,6) => ###.######

https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases

Mongoose: 
https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.Decimal128
https://stackoverflow.com/questions/5605551/decimal-float-in-mongoose-for-node-js

Usar o tipo mongoose.Types.Decimal128
Inserir como string para preservar a precisão
Converter para string para saída

... ou GeoJSON
https://mongoosejs.com/docs/geojson.html

Point Schema
const ecoordenada = new mongoose.Schema({
  name: String,
  descr: String,
  endereco: String,
  location: { //parte do GeoJSON
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

Ex:
longitude comes first in a GeoJSON coordinate array, not latitude.
{
  "type" : "Point",
  "coordinates" : [
    -122.5,
    37.7
  ]
}


Realizar buscas no banco com GeoJSON:
http://thecodebarbarian.com/80-20-guide-to-mongodb-geospatial-queries

*/

/* Outros Dados 
- Nome
- Descrição
- Endereço
- Amenity (OSM)
- Tipos de resíduo
- Data inclusão/alteração
*/

module.exports = mongoose.model('Ecoordenada', ecoordenadaSchema)