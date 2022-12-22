const mongoose  = require('mongoose')

const schema = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true,
    },
    name:{
        type:String
    },
    gender:{
        type:String
    },
    weight:{
        type:Number
    },
    age:{
        type:Number
    },
    addedOn:{
        type:Number
    },
    photo:{
        type:String,
        default:""
    },
    maxTemp:{
        type:Number,
    },
    minTemp:{
        type:Number
    },
    sync:{
        type:String,
        default:"yes"
    }

})

module.exports = mongoose.model('hom_profile',schema)