const jwt = require('jsonwebtoken')
const {invalidToken,unauthorized} = require('../Utils/error_handler')

const tokenVerify = (req,res,next)=>{
    const token = req.headers['token']
    if(!token){
        unauthorized(res,"no token found")
        return
    }
    jwt.verify(token,process.env.SECRET,(err,decoded)=>{
        if(err){
           invalidToken(res,err.message)
           return
        }
        req.body.decoded = decoded._id
        next()
    })
}

module.exports = tokenVerify