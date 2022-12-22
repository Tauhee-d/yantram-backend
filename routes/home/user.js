const express = require('express')
const router = express.Router()
const user = require('../../models/home/hom_user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {missingBody,
    duplicateRecord,
    serverError,
    noResourceFound,
unauthorized} = require('../../Utils/error_handler')
const verifyToken = require('../../middleware/verifyToken')
const sendMail = require('../../Utils/sendEmail')
const crypto = require('crypto')
const verifyResetPassToken = require('../../middleware/veryResetPass')

/**
 * @Desc Test route
 * @Method : GET
 * @path : /
 * @access : public
 */
router.get('/',(req,res)=>{
    res.send("Welcome to route user")
})

/**
 * @Desc Register User
 * @Method : POST
 * @path : /register
 * @access : public
 */
router.post('/register',async(req,res)=>{
    const {email,name,password,addedOn} = req.body
    // const {_id,email,name,password} = req.body
    if( !email || !name ||!password ){
    // if(!_id|| !name|| !email  || !password ){
        missingBody(res)
        return
    }
    try{
        const filter = {email:email}
        const findUser = await user.findOne(filter)
        if(findUser){
            duplicateRecord(res)
            return
        }
        const user_model = new user({
            // _id,
            email,
            name,
            password:bcrypt.hashSync(password,10),
            addedOn
        })
        try{
            await user_model.save()
            // const token = createToken(user_model)
            const token = createToken(user_model._id)
            res.status(201).send({
                token:token
            })
        }catch(err){
            serverError(res,err.message)
        }

    }catch(err){
        serverError(res,err.message)
    }
})


/**
 * @Desc Login User
 * @Method : POST
 * @path : /login
 * @access : public
 */
router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        missingBody(res)
        return
    }

    try{
        const filter = {email:email}
        const foundUser = await user.findOne(filter)
        if(!foundUser){
            noResourceFound(res,"No User Record with given email")
            return
        }
        const result = bcrypt.compareSync(password,foundUser.password)
        if(!result){
            unauthorized(res,"wrong password")
            return
        }

        try{
            const query = {lastLogged:Date.now()}
            await user.findByIdAndUpdate(foundUser._id,query)

        }catch(err){
            serverError(res,err.message)
        }
        const token = createToken(foundUser._id)
        res.status(200).send({
            _id:foundUser._id,
            name:foundUser.name,
            addedOn:foundUser.addedOn,
            token:token
        })
    }catch(err){
        serverError(res,err.message)
    }
})


/**
 * @Desc Password Reset Request
 * @Method : POST
 * @path : /resetPass
 * @access : public
 */
router.post('/resetPass',async(req,res)=>{
    const {email} = req.body
    if(!email){
        missingBody(res)
        return
    }
    try{
        const foundUser = await user.findOne({email:email})
        if(!foundUser){
            noResourceFound(res,"No User Record with given email")
            return
        }
        const resetPasswordToken = crypto.randomBytes(2).toString('hex')
        const resetpasswordExpire = Date.now()+24*60*60*1000

        console.log(`reset pass token : ${resetPasswordToken}`)
        console.log(`reset password expire : ${resetpasswordExpire}`)
        try{
            // update user record with reset password data
            const updateUser = await user.findByIdAndUpdate(foundUser._id,{resetPasswordToken,resetpasswordExpire})
            // send email
            sendMail(email,foundUser.name,resetPasswordToken,res)
        }catch(err){
            serverError(res,err.message)
        }
    }catch(err){
        serverError(res,err.message)
    }
})


/**
 * @Desc Verify reset password token
 * @Method : POST
 * @path : /resetPass
 * @access : public
 */
router.post('/tokenVerify',async(req,res)=>{
    const {token} = req.body
    if(!token){
        missingBody(res)
        return
    }
    const filter = {resetPasswordToken:token}
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
        res.status(200).send({
            message:"success verifying token"
        })
    }catch(err){
        serverError(res,err.message)
    }
})

/**
 * @Desc update password
 * @Method : POST
 * @path : /resetPass
 * @access : public
 */
router.post('/resetPassword',verifyResetPassToken,async(req,res)=>{
    const {password,resetPasswordToken} = req.body
    if(!password || !resetPasswordToken){
        missingBody(res)
        return
    }
    const filter = {resetPasswordToken:resetPasswordToken}
    try{
        const foundUser = await user.findOne(filter)
        if(!foundUser){
            noResourceFound(res,"No User Record found")
            return
        }
        try{
            // update user record with new password  data
            const updateUser = await user.findByIdAndUpdate(foundUser._id,{password:bcrypt.hashSync(password,10)})
            res.status(200).send({
                message:"password update successfully"
            })
        }catch(err){
            serverError(res,err.message)
        }
    }catch(err){
        serverError(res,err.message)
    }
})



// check token is der and update last logged
router.post('/checkToken',verifyToken,async (req,res)=>{
    const id = req.body.decoded
    try{
        const query = {lastLogged:Date.now()}
        await user.findByIdAndUpdate(id,query)
        res.status(200).send({
            message:"token check successful"
        })

    }catch(err){
        serverError(res,err.message)
    }
})

/**
 *  UTIL FUNCTIONS
 */
function createToken(userID){
    return jwt.sign({
        _id:userID},process.env.SECRET,{expiresIn:'30d'})
}


// // test secure route
// router.post('/testSecure',verifyToken,(req,res)=>{
//     console.log(req.body)
//     res.end()
// })

module.exports = router