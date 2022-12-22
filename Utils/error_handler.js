const missingBody = (res)=>{
    res.status(400).send({
        error:"client error"
    })
}

const duplicateRecord = (res)=>{
    res.status(409).send({
        error:"duplicate resource"
    })
}

const serverError = (res,msg)=>{
    res.status(500).send({
        error:msg
    })
}

const invalidToken=(res,msg)=>{
    res.status(498).send({
        error:msg
    })
}

const resetPasswordFail = (res,msg)=>{
    res.status(422).send({
        error:msg
    })
}

const noResourceFound = (res,msg)=>{
    res.status(404).send({
        error:msg
    })
}

const unauthorized = (res,msg)=>{
    res.status(401).send({
        error:msg
    })
}

module.exports  = {missingBody,
    duplicateRecord,
    serverError,
    invalidToken,
    noResourceFound,
    unauthorized,
    resetPasswordFail}