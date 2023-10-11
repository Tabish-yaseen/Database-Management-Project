const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const dynamicRoute=require('./routes/route')

const app=express()
app.use(bodyParser.json())
app.use(cors())

 app.use(dynamicRoute)

app.listen(3000)

 
 
