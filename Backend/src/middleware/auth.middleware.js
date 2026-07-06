import jwt from "jsonwebtoken"

export async function authUser(req,res,next){
    try {
       const {token} = req.cookies
       
       if(!token){
        return res.status(401).json({
            message:"anauthorized user. Token not provided"
        })
       }

       const decoded = await jwt.verify(token , process.env.JWT_SECRET)
       req.user = decoded
       next()
    } catch (error) {
      return res.status(401).json({
        message:error.message,
        success:false
    })
    }
}