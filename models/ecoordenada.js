//Modelo de dados do mongoose
const mongoose = require('mongoose')

const ecoordenadaSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

/* Tipo de dado para Latitude e longitude:

lat: Decimal(8,6) => ##.######
lon: Decimal(9,6) => ###.######

https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases

Mongoose: 
https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.Decimal128
https://stackoverflow.com/questions/5605551/decimal-float-in-mongoose-for-node-js
https://mongoosejs.com/docs/geojson.html

Usar o tipo mongoose.Types.Decimal128
Inserir como string para preservar a precisão
Converter para string para saída

... ou GeoJSON

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