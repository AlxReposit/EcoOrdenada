require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const port = 3000

//Conexão ao MongoDB com Mongoose
mongoose.connect(process.env.DATABASE_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
const db=mongoose.connection

db.on('error', (err) => console.log(err))
db.on('open', () => console.log('Banco de Dados conectado'))

//Middlewares para utilizar JSON e servir arquivos públicos
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')))
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap-icons/font')))
app.use('/leaflet', express.static(path.join(__dirname, '/node_modules/leaflet/dist')))

//Middlewares para Rotas
const ecoordenadasRouter = require('./routes/ecoordenadas')
app.use('/ecoordenadas', ecoordenadasRouter)

//Iniciando servidor
app.listen(port, ()=>{
    console.log('servidor rodando em: http://localhost:' + port)
})