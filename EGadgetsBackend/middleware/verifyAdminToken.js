// const jwt = require('jsonwebtoken');
// const JWT_SECRET = "80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32"

// const verifyAdminToken =  (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];

//     // console.log(token)

//     if (!token) {
//         return res.status(401).json({ message: 'Access Denied. No token provided' });
//     }
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid credientials' });
//         }
//         req.user = user;
//         next();
//     })

// }

// module.exports = verifyAdminToken;
const jwt = require('jsonwebtoken');
const JWT_SECRET = "80ce475b473a1605178f5371eb112e92d42fc0c521dfb2a6f01ffa60568dabc32";

const verifyAdminToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        // Check if user is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied. Admins only' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyAdminToken;
