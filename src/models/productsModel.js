
const Cart=require('../models/CartModel')
const db=require('../config/database')
class Product{
    constructor(id,title,imageUrl,description,price){
        this.id=id
        this.title=title
        this.imageUrl=imageUrl
        this.description=description
        this.price=price
    }
    save(){
        // thay thế các giá trị trong mảng vào ?
        return db.execute('INSERT INTO products (title,imageUrl,description,price) VALUES(?,?,?,?)',
            [this.title,this.imageUrl,this.description,this.price]
        )
    }
    static deleteById(id){
      
    }
     static fetchAll(cb){
        return db.execute('SELECT*FROM products')
     }

     static findById(id){
        return db.execute('SELECT*FROM products WHERE products.id=?',[id])
     }   
}
module.exports=Product