const express = require('express')
const router = express.Router()
const Ecoordenada = require('../models/ecoordenada')

// Rota para Buscar todos os registros
router.get('/', async (req, res) => {
    try {
        const ecoordenadas = await Ecoordenada.find()
        res.json(ecoordenadas)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Rota para Buscar registro por ID
/*router.get('/:id', getEcoordenada, async (req, res) => {
    try {
        res.json(res.ecoordenada)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})*/

// Rota para Buscar registros com base na distância em relação a um ponto
// http://thecodebarbarian.com/80-20-guide-to-mongodb-geospatial-queries
router.get('/buscarEcoordenada/:lon/:lat/:distancia', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");

        const ecoordenada = await Ecoordenada.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[req.params.lon, req.params.lat], req.params.distancia / 3963.2]
                }
            }
        })

        if (ecoordenada == null) {
            return res.status(404).json({ message: 'Erro: local não enconctrado.' })
        }

        res.json(ecoordenada)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Rota para Buscar registros localizados dentro de um polígono
router.post('/buscarEcoordenada', async (req, res) => {
    try {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");

        const ecoordenada = await Ecoordenada.find({
            location: {
                $geoWithin: {
                    $geometry: req.body.poligono
                }
            }
        })

        if (ecoordenada == null) {
            return res.status(404).json({ message: 'Erro: local não enconctrado.' })
        }

        res.json(ecoordenada)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Rota para Incluir novo registro
/*router.post('/novaEcoordenada', async (req, res) => {
    const ecoordenada = new Ecoordenada({
        nome: req.body.nome,
        descricao: req.body.descricao,
        endereco: req.body.endereco,
        osm_amenity: req.body.osm_amenity,
        localizacao: {
            type: 'Point',
            coordenadas: [
                req.body.lon,
                req.body.lat,
            ]
        }
    })

    try {
        const novaEcoordenada = await ecoordenada.save()
        res.status(201).json(novaEcoordenada)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})*/

// Rota para Atualizar registro
/*router.patch('/atualizarEcoordenada/:id', getEcoordenada, async (req, res) => {
    if (req.body.nome != null) res.ecoordenada.nome = req.body.nome
    if (req.body.descricao != null) res.ecoordenada.descricao = req.body.descricao
    if (req.body.endereco != null) res.ecoordenada.endereco = req.body.endereco
    if (req.body.osm_amenity != null) res.ecoordenada.osm_amenity = req.body.osm_amenity
    if (req.body.localizacao != null) res.ecoordenada.localizacao = req.body.localizacao
    / *if(req.body.lon != null && req.body.lat != null){
        res.ecoordenada.localizacao = {
            type: 'Point',
            coordenadas: [
                req.body.lon,
                req.body.lat,
            ]
        }
    }* /

    try {
        const atualizaEcoordenada = res.ecoordenada.save()
        res.status(201).json(atualizaEcoordenada)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})*/

// Rota para Deletar registro
/*router.delete('/deletarEcoordenada/:id', getEcoordenada, async (req, res) => {
    try {
        await res.ecoordenada.deleteOne()
        res.json({ message: 'O registro do Local foi excluído com sucesso.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})*/

// Função de middleware para validação do ID informado
async function getEcoordenada(req, res, next) {
    try {
        const ecoordenada = Ecoordenada.findById(req.params.id)

        if (ecoordenada == null) {
            return res.status(404).json({ message: 'Erro: local não enconctrado.' })
        }

        res.ecoordenada = ecoordenada
        //console.log(ecoordenada)
        next()

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = router