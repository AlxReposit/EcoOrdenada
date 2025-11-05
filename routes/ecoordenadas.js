const express = require('express')
const router = express.Router()
const Ecoordenada = require('../models/ecoordenada')

router.get('/', async (req, res) => {
    try {
        const ecoordenadas = await Ecoordenada.find()
        res.json(ecoordenadas)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', getEcoordenada, async (req, res) => {
    try {
        res.json(res.ecoordenada)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/', async (req, res) => {
    try {
        //finalizar estrutura dos dados
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.patch('/:id', getEcoordenada, async (req, res) => {
    try {
        //finalizar estrutura dos dados
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', getEcoordenada, async (req, res) => {
    try {
        await res.ecoordenada.deleteOne()
        res.json({message: 'O registro do Local foi excluído com sucesso.'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

async function getEcoordenada(req, res, next) {
    try {
        const ecoordenada = Ecoordenada.findById(req.params.id)

        if(ecoordenada == null) {
            return res.status(404).json({message: 'Erro: local não enconctrado.'})
        }

        res.ecoordenada = ecoordenada;
        next()
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = router