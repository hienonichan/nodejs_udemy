const Product=require('../models/productsModel')
const Cart=require('../models/CartModel')
const Order=require('../models/OrderModel')
const { TableHints } = require('sequelize')

class ShopController{
    //GET /shop/products
    async getProducts(req,res,next){
        try {
            const products=await req.user.getProducts()
            const productsData1=await req.user.getProducts({raw:true})
            const productsData2=products.map(product=>product=product.get({plain:true}))
            res.render('shop/product-list',{pageTitle:'shop page',products:productsData2}) 
        } catch (error) {
           console.log(err)
        }
    }

    //GET /shop/index
    async getIndex(req,res,next){
        try {
            const products=await req.user.getProducts()
            // chuyển về object cơ bản
            const productsData=products.map(product=>product=product.get({plain:true}))
            res.render('shop/index',{pageTitle:'index page',products:productsData})
        } catch (error) {
            console.log(error)
        }
    }

     //GET /shop/products/:productId
     async getProduct(req,res,next){
        try {
            const product=await Product.findOne({where:{id:req.params.productId},raw:true})
            res.render('shop/product-detail',{pageTitle:'detail page',product:product})
        } catch (error) {
            console.log(error)
        }
    }


    //GET /shop/cart
    async getCart(req,res,next){
        try {
            const cart=await req.user.getCart()
            const products=await cart.getProducts()
            // chuyển đổi đối tượng sequelize thành đối tượng js cơ bản
            const productsData = products.map(product => product.get({ plain: true }));
            res.render('shop/cart',{pageTitle:'your cart',products:productsData})
        } catch (error) {
            console.log(error)
        }
    }

    //POST /shop/cart
     async postCart(req,res,next){
        try {
            const prodId=req.body.productId
            const cart=await req.user.getCart()
            const products=await cart.getProducts({where:{id:prodId}})
            let product
            let newQuantity=1
            if(products.length>0){
              product=products[0]
            }
            if(product){
            // nếu đã có sản phẩm thì tăng quantity lên ++
            const oldQuantity=product.cartItem.dataValues.quantity
            newQuantity=oldQuantity+1
            }
            // nếu chưa có sản phẩm thì create với quantity ban đầu là 1
            else{
            product=await Product.findOne({where:{id:prodId}})
            }
            // add quantity với 1 product
            await cart.addProduct(product,{through:{quantity:newQuantity}})    
            res.redirect('/shop/index')
        } catch (error) {
            console.log(error)
        }
    }

    //GET /shop/checkout
    // Thanh toán hàng
    getCheckout(req,res,next){
        res.render('shop/checkout',{pageTitle:'checkout page'})
    }
 
    //GET /shop/orders
    async getOrders(req,res,next){
        const Orders=await req.user.getOrders()
        let arrayOfOrders=[]
        let TotalPriceAll=0
        // mỗi ptu của orders duyệt lấy products
        for(let index=0;index<Orders.length;index++){
            const products=await Orders[index].getProducts()
            // chuyyển thành object thông thường
            const productsData=products.map(product=>product=product.get({plain:true}))
            // tính giá tiền mỗi order
            let totalPrice=0
            for(let k=0;k<productsData.length;k++){
                totalPrice+=Number(productsData[k].price)*Number(productsData[k].orderItem.quantity)
            }
            arrayOfOrders.push({productsData,totalPrice})
            TotalPriceAll+=totalPrice
        }
        res.render('shop/orders',{pageTitle:'Orders page',orders:arrayOfOrders,total:TotalPriceAll})
    }
    //POST /shop/create-order
    async postOrder(req,res,next){
        try {
            //Lấy sản phẩm từ giỏ hàng
           const cart=await req.user.getCart()
           const products=await cart.getProducts()
           //Tạo order
           const order=await req.user.createOrder()
           // thêm sản phẩm vào order
           // add quantity với nhiều products
           // gán thêm trường orderItem cho product
            const result= await order.addProducts(products.map(product=>{
            product.orderItem={quantity:product.dataValues.cartItem.quantity}
            return product
           }))
           // sau khi đặt hàng xong thì set cart trống
           await cart.setProducts(null)
           res.redirect('/shop/orders')
        } catch (error) {
            console.log(error)
        }
    }

    //DELETE /shop/cart/delete/:productId
    async deleteFromCart(req,res,next){
        try {
            const prodId=req.params.productId
            const cart=await req.user.getCart()
            const products=await cart.getProducts({where:{id:prodId}})
            const product=products[0]
            // xóa dữ liệu foreign key
            await product.dataValues.cartItem.destroy()
            res.redirect('/shop/cart')
        } catch (error) {
            console.log(error)
        }
    }

    
}
module.exports=new ShopController()