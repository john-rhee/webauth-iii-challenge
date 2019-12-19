//TOKEN//
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

    jwt.verify(authorization, secret, function(err, decodedToken) {
      if (err) {
        res.status(401).json({ message: "Invalid Token" });
      } else {
        req.token = decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json({ message: "Please login and try again" });
  }
};

//SESSION MIDDLEWARE//
// module.exports = (req, res, next) => {
//     if (req.session && req.session.user) {
//       next();
//     } else {
//       res.status(401).json({ message: "You shall not pass!!" });
//     }
//   };
  