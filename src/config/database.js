const mysql=require('mysql2')

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    database:'nodejs',
    password:'hienhien123@'
})
// xuất đi instance mysql
module.exports=pool.promise()