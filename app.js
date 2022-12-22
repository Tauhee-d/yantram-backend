const express = require('express')
require('dotenv').config()
const logger = require('morgan')
const db = require('./db/conn')
const cors = require('cors')


/**
 *  api path version
 */
const api_path = '/api/v1'

/**
 *  routes location
 */
const hom_userRoute = require('./routes/home/user')
const hom_profileRoute = require('./routes/home/profile')
const hom_user_path = api_path+'/auth/home'
const hom_profile_path = api_path+'/profile/home'

const port = process.env.PORT || 5000
db()

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(cors({origin:true,credentials:true}))


app.get('/',(req,res)=>{
    res.send("Welcome to Yantram Platform")
})

/* home user , auth */
app.use(hom_user_path,hom_userRoute);
/* home profile */
app.use(hom_profile_path,hom_profileRoute)


app.use('*',(req,res)=>{
    res.status(404).send("404 Page Not found")
})

app.listen(port,()=>{
    console.log(`Server Started on ${port}`)
})