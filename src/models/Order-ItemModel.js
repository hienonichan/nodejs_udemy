const Sequelize=require('sequelize')
const sequelize=require('../config/database')

const OrderItem=sequelize.define('orderItem',{
  id:{type:Sequelize.INTEGER,autoIncrement:true,allowNULL:false,primaryKey:true},
  quantity:{type:Sequelize.INTEGER},
})
module.exports=OrderItem