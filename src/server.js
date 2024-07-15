const express=require('express')
const app=express()
const PORT=3000
const hbs=require('express-handlebars')
const path=require('path')
const route=require('./routes')
const methodOverride=require('method-override')

const sequelize=require('./config/database')
const Product=require('./models/productsModel')
const User=require('./models/UserModel')
const Cart=require('./models/CartModel')
const CartItem=require('./models/Cart-ItemModel')
const Order=require('./models/OrderModel')
const OrderItem=require('./models/Order-ItemModel')

//config body-parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//config middleware methodOverride
app.use(methodOverride('_method'))

///config handlebars
app.engine('handlebars',hbs.engine())
app.set('view engine','handlebars')
app.set('views',path.join(__dirname,'views'))


// thiết lập quan hệ các bảng
//1 quan hệ user-product
User.hasMany(Product)
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
//2 quan hệ user và cart
User.hasOne(Cart)
Cart.belongsTo(User)
//3 quan hệ cart và product
Cart.belongsToMany(Product,{through: CartItem})
Product.belongsToMany(Cart,{through:CartItem})
//4 quan hệ Order User
User.hasMany(Order)
Order.belongsTo(User)
//5 quan hệ Order và Product 
Order.belongsToMany(Product,{through:OrderItem})
Product.belongsToMany(Order,{through:OrderItem})

app.use(async (req,res,next)=>{
    try {
        // Lấy ra user (đây là fake authenication)
        // không được lấy raw vì nếu lấy raw sẽ mất 
        // các hàm instance trong quan hệ table
        const user=await User.findOne({where:{id:1}})
        req.user=user 
        next()
    } catch (error) {
        console.log(error)
    }
})

// start route
route(app)

// Đồng bộ model với database,nếu chưa có table theo model thì nó sẽ create table
// tùy chọn force:true là khi bạn thêm một relation mới và muốn dữ liệu tự fix
sequelize.sync()
//sequelize.sync({force:true})
.then(results=>{
    return User.findOne({where:{id:1}})
})
.then(user=>{
    if(!user){
        return User.create({name:'Max',email:'test@test.com'})
    }
    return user
})
.then(user=>{
    // khi tồn tại user thì tạo một đối tượng Cart belong to User
    // data khi cần in ra views mới raw:true, còn không thì thôi vì sẽ làm mất các hàm quan hệ
   // user.createCart()
})
.then(cart=>{
    // khi mọi thứ khởi tạo đúng thì mới listen server
    app.listen(PORT,()=>{
        console.log('server is running at http://localhost:'+PORT+'/shop/index')
    })
})
.catch(err=>{
    console.log(err)
})



