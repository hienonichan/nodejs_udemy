class ErrorController{
    error404(req,res,next){
        res.render('404',{pageTitle:'Page Not Found!!!'})
    }
}

module.exports=new ErrorController()