const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // retrieve token
  const { token, email } = req.body;

  if(!token) {
    return res.status(401).json({errors: [{ msg: 'No Token Provided. Authorization Denied!' }]});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    if(decoded.user.email === email) {
      next();
    } else {
      res.status(401).json({errors: [{ msg: 'Token is not valid' }]});
    }
  } catch (err) {
    res.status(401).json({errors: [{ msg: 'Token is not valid' }]});
  }
}