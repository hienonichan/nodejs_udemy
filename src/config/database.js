const Sequelize=require('sequelize')
// cấu hình kết nối database
const sequelize=new Sequelize(
    'nodejs',
    'root',
    'hienhien123@',
    {dialect:'mysql',host:'localhost'})
module.exports=sequelize