const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public', {
    index: false, 
    immutable: true, 
    cacheControl: true,
    maxAge: "30d"
}))

app.post('/submit', (req, res, next)=>{
    
})

app.listen(port, ()=>{
    console.log('servidor rodando na porta ' + port)
})