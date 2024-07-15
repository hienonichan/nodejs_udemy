const Sequelize=require('sequelize')
const sequelize=require('../config/database')

const CartItem=sequelize.define('cartItem',{
  id:{type:Sequelize.INTEGER,autoIncrement:true,allowNULL:false,primaryKey:true},
  quantity:{type:Sequelize.INTEGER},
})
module.exports=CartItem