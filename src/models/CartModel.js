const fs=require('fs')
const path=require('path')
const Product=require('../models/productsModel')
const p=path.join(path.dirname(process.mainModule.filename),'data','cart.json')

class Cart{
    static addProduct(id,productPrice){
       //fetch the before cart
       fs.readFile(p,(err,fileContent)=>{
        let cart={products:[],totalPrice:0}
           if(!err){
             cart=JSON.parse(fileContent)
           }
           // get the before products
           const existingProductIndex=cart.products.findIndex(prod=>prod.id===id)
           const existingProduct=cart.products[existingProductIndex]
           let updatedProduct
           if(existingProduct){
            updatedProduct={...existingProduct}
            // nếu sản phẩm tồn tại thì tăng số lượng sản phẩm lên 1
            updatedProduct.qty=updatedProduct.qty+1
            // mảng sản phẩm không thay đổi
            cart.products=[...cart.products]
            // update product mới với cái qty là ++
            cart.products[existingProductIndex]=updatedProduct
           }
           else{
                // nếu không thì số lượng khởi tạo là 1
                updatedProduct={id:id,qty:1}
                // chèn updatedProduct vào mảng sản phẩm
                cart.products=[...cart.products,updatedProduct]
          }
           cart.totalPrice=Number(cart.totalPrice)+Number(productPrice)
           fs.writeFile(p,JSON.stringify(cart),(err)=>{
            console.log(err)
           })
       })
    }


     //xóa khỏi giỏ hàng
     static deleteProduct(id,productPrice){
      fs.readFile(p,(err,fileContent)=>{
          if(err){
              return;
          }
          const updatedCart={...JSON.parse(fileContent)}
          const product=updatedCart.products.find((prod)=>prod.id===id)
          if(!product){
            return;
          }
          const productQty=product.qty
          updatedCart.products=updatedCart.products.filter((prod)=>prod.id!==id)
          // trừ tổng giá của product mình xóa
          updatedCart.totalPrice=updatedCart.totalPrice-productPrice*productQty

          // Lưu vào trong db
          fs.writeFile(p,JSON.stringify(updatedCart),(err)=>{
              console.log(err)
          })
      })
   }


   // hiện product trong cart
   static getCart(cb){
      fs.readFile(p,(err,fileContent)=>{
        const cart=JSON.parse(fileContent)
        cb(cart)
      })
   }

}

module.exports=Cart