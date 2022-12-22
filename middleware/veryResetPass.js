const user = require('../models/home/hom_user')
const {unauthorized,noResourceFound,serverError} = require('../Utils/error_handler') 

const verifyResetPass = async (req,res,next)=>{
    const {resetPasswordToken} = req.body
    if(!resetPasswordToken){
        unauthorized(res,"no token found")
        return
    }
    const filter = {resetPasswordToken:resetPasswordToken}
    try{
        const foundUser = await user.findOne(filter)
        if(!foundUser){
            noResourceFound(res,"No User Record with given token")
            return
        }
        if(Date.now()>foundUser.resetpasswordExpire){
            unauthorized(res,"token expired")
            return
        }
        next()
    }catch(err){
        serverError(res,err.message)
    }
        
}

module.exports = verifyResetPass