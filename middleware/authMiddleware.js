const jwt = require('jsonwebtoken');

const authenticateRequest = (req, res, next) => {
    try {
        const token = req.header("authorization");         
        if(token){
            jwt.verify(token, process.env.JWT_SEC, function(err, decoded) {
                if(err){               
                    return res.status(400).send({error: "Bad request!"});
                }
                if(decoded.data){            
                    req.user = decoded.data;
                    next();
                }
            });    
        } else {
            res.status(400).send({error: "Bad request!"});
        }
    } catch (error) {
        res.status(500).send({error: "Server error"});
    }
};

module.exports = authenticateRequest;