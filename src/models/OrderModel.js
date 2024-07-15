const Sequelize=require('sequelize')
const sequelize=require('../config/database')

const Order=sequelize.define('order',{
  id:{type:Sequelize.INTEGER,autoIncrement:true,allowNULL:false,primaryKey:true},
})
module.exports=Order