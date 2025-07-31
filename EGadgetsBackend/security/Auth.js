const jwt= require("jsonwebtoken")
// Fix: Add the leading "8" to match the secret key used in other files
const SECRET_KEY="80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32";

function authenticateToken(req,res,next){
    const token=req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Access denied: No token provided")
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY)
        req.user = verified;
        next()
    }catch (e) {
        res.status(400).send("Invalid token")
    }

}

function authorizeRole(role){
    return (req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).send("Access Denied:Insufficient Permissions")
        }

        next();
    }
}

module.exports={authenticateToken,authorizeRole}