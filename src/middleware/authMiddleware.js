import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    // const token = req.headers.token.split(' ')[1];
    let token = req.headers["authorization"];
    console.log("token", token)

    if(!token){
        return res.status(404).json({
            message: 'Token is valid'
        })
    }
    let key = process.env.ACCESS_TOKEN_SECRET;
    jwt.verify(token, key, function(err, user) {
        if(err){
            return res.status(404).json({
                message: 'The user is not authentication'
            })
        }
        if(user.id){
            next()
        }else {
            return res.status(404).json({
                message: 'The user is not authentication'
            })
        }
    });
}

export default authMiddleware