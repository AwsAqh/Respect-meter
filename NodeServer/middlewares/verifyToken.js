const jwt = require('jsonwebtoken');

// Define the secret key directly in the middleware (should match the one used in controller)
const secretKey = 'your_secret_key';  

const verifyToken = (req, res, next) => {
  
  let token;

  if (req.header("x-auth-token")) {
    token = req.header('x-auth-token');
  }
  
  else if (req.header("Authorization")) {
    token = req.header("Authorization").split(' ')[1];
  }

 
  if (!token) {
    return res.status(401).json({ msg: 'No token provided, authorization denied' });
  }

  try {
    
    const decoded = jwt.verify(token, secretKey); 

   

    req.user = decoded.id;  

    return next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ msg: 'Token is invalid or expired' });
  }
};


module.exports = verifyToken;
