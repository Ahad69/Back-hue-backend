
const jwt = require("jsonwebtoken");

function verifyToken(req , res , next){
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
          return res.status(401).send({message : 'unauthorised'})
        }
        const token = authHeader.split(' ')[1]
        jwt.verify(token , process.env.JWT_SECRET , (err , decoded)=>{
          if(err){
            return res.status(403).json({message : 'Forbidden'})
          }
          else{
            req.decoded = decoded;
            next()
          }
        })
      
    } catch (error) {
        console.log(error) 
        next("Authentication Error")
    }

  }

module.exports = verifyToken