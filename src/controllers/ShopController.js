const Product=require('../models/productsModel')
const Cart=require('../models/CartModel')
class ShopController{
    //GET /shop/products
    async getProducts(req,res,next){
        try {
            const [rows,fieldData]=await Product.fetchAll()
            res.render('shop/product-list',{pageTitle:'shop page',products:rows}) 
        } catch (error) {
           console.log(err)
        }
    }

    //GET /shop/index
    async getIndex(req,res,next){
        try {
            const [rows,fieldData]=await Product.fetchAll()
            res.render('shop/index',{pageTitle:'index page',products:rows})
        } catch (error) {
            console.log(error)
        }
    }

     //GET /shop/products/:productId
     async getProduct(req,res,next){
        try {
            const prodId=req.params.productId
            const [[product],fieldData]=await Product.findById(prodId)
            console.log(product)
            res.render('shop/product-detail',{pageTitle:'detail page',product:product})
        } catch (error) {
            console.log(error)
        }
    }


    //GET /shop/cart
    getCart(req,res,next){
        Cart.getCart((cart)=>{
            Product.fetchAll(products=>{
                const cartProducts=[]
                const totalPrice=cart.totalPrice
                for(let product of products){
                    const cartProductData=cart.products.find(prod=>prod.id===product.id)
                    if(cartProductData){
                        // thêm vào trong cartProducts thông tin sản phẩm và qty để render trong cart
                        cartProducts.push({productData:product,qty:cartProductData.qty})
                    }
                }
                res.render('shop/cart',{pageTitle:'your cart',products:cartProducts,totalPrice:totalPrice})
            })
        })
    }
    //GET /shop/checkout
    // Thanh toán hàng
    getCheckout(req,res,next){
        res.render('shop/checkout',{pageTitle:'checkout page'})
    }

    //GET /shop/orders
    getOrders(req,res,next){
        res.render('shop/orders',{pageTitle:'Orders page'})
    }

   
    //POST /shop/cart
    postCart(req,res,next){
        const prodId=req.body.productId
        Product.findById(prodId,(product)=>{
             Cart.addProduct(prodId,product.price)
        })
        res.redirect('/shop')
    }

    deleteFromCart(req,res,next){
        const prodId=req.params.productId
        Product.findById(prodId,(product)=>{
            Cart.deleteProduct(prodId,product.price)
            res.redirect('/shop/cart')
        })
    }
}
module.exports=new ShopController()