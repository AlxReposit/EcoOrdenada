const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap-icons/font')))
app.use('/leaflet', express.static(path.join(__dirname, '/node_modules/leaflet/dist')))

app.post('/submit', (req, res, next)=>{
    
})

app.listen(port, ()=>{
    console.log('servidor rodando na porta ' + port)
})