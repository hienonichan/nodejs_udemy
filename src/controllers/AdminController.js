const Product=require('../models/productsModel')
const User=require('../models/UserModel')

class AdminController{
     //GET admin/add-products
     getAddproducts(req,res,next){
        res.render('admin/add-products',{pageTitle:'Adding page'})
    }

    //POST admin/products
    async postProducts(req,res,next){
         try {
            // Hàm tạo foreign key trong bảng product
            // hàm này được tạo tự động khi thiết lập quan hệ các Model 
            // không cần phải create Product sau đó thêm foreign key thủ công
            await req.user.createProduct({
               title:req.body.title,
               price:req.body.price,
               imageUrl:req.body.imageUrl,
               description:req.body.description,
            })

            //   // cách khác là thêm thủ công 
            //   await Product.create({
            //    title:req.body.title,
            //    price:req.body.price,
            //    imageUrl:req.body.imageUrl,
            //    description:req.body.description,
            //    userId:req.user.id,
            //   })
               console.log('add product successfully')
              res.status(201).redirect('/shop/index')
         } catch (error) {
            console.log(error)
         }
    }

    //GET admin/products
    async getProducts(req,res,next){
      try {
         //const products=await Product.findAll({raw:true})
         const products=await req.user.getProducts({raw:true})
         res.render('admin/products',{products:products,pageTitle:'Admin products'}) 
      } catch (error) {
         console.log(error)
      }
     }


     //GET admin/edit-product/:productId
     async getEditProduct(req,res,next){
      try {
         const editMode=req.query.edit
        if(!editMode){      
           return res.redirect('/admin/products')
        }
        const prodId=req.params.productId
         //// cách 1: tìm product ngay trong bảng Product
         //const product=await Product.findOne({where:{id:prodId},raw:true})
         //cách 2: tìm product thông qua user vì đã thiết lập quan hệ
        const [product]=await req.user.getProducts({where:{id:prodId},raw:true})
        res.render('admin/edit-product',{pageTitle:'edit page',editing:editMode,product:product})
      } catch (error) {
         console.log(error)
      }
     }

     //PUT /admin/edit-product/:productId
     async putEditProduct(req,res,next){
      try {
          // có thể dùng hàm update hoặc findOne sau đó .save()
        const prodId=req.params.productId
        const updatedTitle=req.body.title
        const updatedImageUrl=req.body.imageUrl
        const updatedDescription=req.body.description
        const updatedPrice=req.body.price
        await Product.update({title:updatedTitle,imageUrl:updatedImageUrl,description:updatedDescription,price:updatedPrice}
         ,{where:{id:prodId}}
        )
        res.redirect('/admin/products')
      } catch (error) {
         console.log(error)
      }
     }


     //DELETE /admin/delete-product/:productId
     async deleteProduct(req,res,next){
      try {
         const prodId=req.params.productId
         await Product.destroy({where:{id:prodId}})
         res.redirect('/admin/products')
      } catch (error) {
         console.log(error)  
      }
     }
}

module.exports=new AdminController()