const mongoose = require('mongoose')

const database = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connect to DB : ${conn.connection.host}`)
    }catch(err){
        console.log(`DB connection failed : ${err}`)
    }
}

module.exports = database