const express = require('express')
const router = express.Router()
const {missingBody,
    duplicateRecord,
    serverError,
    noResourceFound,
unauthorized} = require('../../Utils/error_handler')
const verifyToken = require('../../middleware/verifyToken')
const profile = require('../../models/home/hom_profile')


/**
 * @Desc Test route
 * @Method : GET
 * @path : /
 * @access : public
 */
router.get('/',(req,res)=>{
    res.send("Welcome to route profile")
})


/**
 * @Desc create new profile
 * @Method : POST
 * @path : /
 * @access : token
 */
router.post('/',verifyToken,async(req,res)=>{
    const userID = req.body.decoded
    const {_id,name,gender,weight,age,addedOn,photo} = req.body

    if(!_id || !name || !gender || !weight || !age || !addedOn){
        missingBody(res)
        return
    }
    try{
        const saveProfile = new profile({_id,userID,name,gender,weight,age,addedOn,photo})
        await saveProfile.save()
        res.status(201).send({
            message:"success"
        })

    }catch(err){
        serverError(res,err.message)
    }

})

/**
 * @Desc get all profiles from userID
 * @Method : GET
 * @path : /
 * @access : token
 */
router.get('/all',verifyToken,async(req,res)=>{
    const userID = req.body.decoded
    try{
        const profiles = await profile.find({userID})
        res.status(200).json(profiles)
    }catch(err){
        serverError(res,err.message)
    }

})


/**
 * @Desc delete profile
 * @Method : DELETE
 * @path : /
 * @access : token
 */
router.delete('/:id',verifyToken,async(req,res)=>{
    const userID = req.body.decoded
    const profileID = req.params.id
    if(!profileID){
        missingBody(res)
        return
    }
    try{
        const delProfile = await profile.findById({_id:profileID})
        if(!delProfile){
            noResourceFound(res,"no Profile record present")
            return
        }
        await profile.findByIdAndDelete({_id:delProfile._id})
        // TODO delete readings associated with this profile
        res.status(200).send({
            message:"success"
        })
    }catch(err){
        serverError(res,err.message)
    }
})


/**
 * @Desc update profile
 * @Method : PUT
 * @path : /
 * @access : token
 */

router.put('/:id',verifyToken,async(req,res)=>{
    const userID = req.body.decoded
    const profileID = req.params.id

    if(!profileID){
        missingBody(res)
        return
    }
    try{
        const delProfile = await profile.findById({_id:profileID})
        if(!delProfile){
            noResourceFound(res,"no Profile record present")
            return
        }

        await profile.findByIdAndUpdate({_id:delProfile._id},req.body)
        // TODO delete readings associated with this profile
        res.status(204).send({
            message:"success"
        })
    }catch(err){
        serverError(res,err.message)
    }
})


module.exports = router