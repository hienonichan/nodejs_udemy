const Product=require('../models/productsModel')
class AdminController{
     //GET admin/add-products
     getAddproducts(req,res,next){
        res.render('admin/add-products',{pageTitle:'Adding page'})
    }

    //POST admin/products
    async postProducts(req,res,next){
         try {
            const product=new Product(null,req.body.title,req.body.imageUrl,req.body.description,req.body.price)
            await product.save()
            console.log('add successfully')
            res.status(201).redirect('/shop/index')
         } catch (error) {
            console.log(error)
         }
    }

    //GET admin/products
    getProducts(req,res,next){
        const products=Product.fetchAll((products)=>{
         res.render('admin/products',{products:products,pageTitle:'Admin products'})
        })
     }


     //GET admin/edit-product/:productId
     getEditProduct(req,res,next){
        const editMode=req.query.edit
        if(!editMode){      
           return res.redirect('/admin/products')
        }
        const prodId=req.params.productId
        Product.findById(prodId,(product)=>{
            res.render('admin/edit-product',{pageTitle:'edit page',editing:editMode,product:product})
        })
     }

     //PUT /admin/edit-product/:productId
     putEditProduct(req,res,next){
        const prodId=req.params.productId
        const updatedTitle=req.body.title
        const updatedImageUrl=req.body.imageUrl
        const updatedDescription=req.body.description
        const updatedPrice=req.body.price
        const updatedProduct=new Product(prodId,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice)
        updatedProduct.save()
        res.redirect('/admin/products')
     }


     //DELETE /admin/delete-product/:productId
     deleteProduct(req,res,next){
        Product.deleteById(req.params.productId)
        res.redirect('/admin/products')
     }
}

module.exports=new AdminController()