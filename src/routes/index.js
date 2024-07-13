
const adminRouter=require('./admin')
const shopRouter=require('./shop')
const errorController=require('../controllers/ErrorController')
function route(app){
     app.use('/admin',adminRouter)
     app.use('/shop',shopRouter)
     //page not found route
    // app.use(errorController.error404)
}
module.exports=route