import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import bodyParser from 'body-parser'
import path from 'path'
const app = express()
const PORT = process.PORT || 3000
app.set('view engine','html')

app.use(express.static(path.resolve(__dirname,"./build")))
app.use(cors());
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/',(req,res) => { 
    res.sendFile(path.resolve(__dirname,'build/index.html'))   
})

const server = app.listen(PORT,() => {    
console.log(`Server running on port ${server.address().port}`)    
})