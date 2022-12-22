const mongoose  = require('mongoose')

const schema = new mongoose.Schema({
    // _id:{
    //     type:String,
    //     required:true
    // },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String
    },
    name:{
        type:String
    },
    role:{
        type:String,
        default:"customer"
    },
    share:{
        type:String
    },
    addedOn:{
        type:Number
    },
    lastLogged:{
        type:Number
    },
    sync:{
        type:String,
        default:"yes"
    },
    resetPasswordToken:{
        type:String
    },
    resetpasswordExpire:{
        type:Date
    }


})

module.exports = mongoose.model('hom_user',schema)