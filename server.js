const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.post('/submit', (req, res, next)=>{
    
})

app.listen(port, ()=>{
    console.log('servidor rodando na porta ' + port)
})