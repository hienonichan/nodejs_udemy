const express=require('express')
const app=express()
const PORT=3000
const hbs=require('express-handlebars')
const path=require('path')
const route=require('./routes')
const methodOverride=require('method-override')
const db=require('./config/database')

//config body-parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//config middleware methodOverride
app.use(methodOverride('_method'))

///config handlebars
app.engine('handlebars',hbs.engine())
app.set('view engine','handlebars')
app.set('views',path.join(__dirname,'views'))
route(app)
app.listen(PORT,()=>{
    console.log('server is running at http://localhost:'+PORT+'/shop/index')
})
