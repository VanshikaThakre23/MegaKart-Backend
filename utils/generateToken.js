const jwt = require('jsonwebtoken');

 const generateToken=(user)=>{
    return jwt.sign(
        {id:user._id,
         email:user.email
        },//ye dono payload hai
        process.env.JWT_SECRET_KEY,//jwt ki secret key
        {expiresIn:"7d"}//optional hota h but daldo accha rehta
    )
};
module.exports = generateToken;

