const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("./user-model.js");

const restricted = require("../restricted-middleware.js");

const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  let user = req.body;

  // hash the password
  const hash = bcrypt.hashSync(user.password, 14); // the 8 is the number of rounds (2^8) (iterations)

  // override the plain text password with the hash
  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = signToken(saved);
      res.status(201).json({
        user:saved,
        token
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
//TOKEN LOGIN//
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // sign token
        const token = signToken(user); // new line

        // send the token
        res.status(200).json({
          token, // added token as part of the response sent
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error" });
    });
});

// this functions creates and signs the token
function signToken(user) {
  const payload = {
    username: user.username,
    role: user.role_id, 
    password:user.password,
    id: user.id
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options); // notice the return
}

//TOKEN GET USERS//
router.get("/", restricted, checkRole(1), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

function checkRole(role) {
  return function(req, res, next) {
    if (req.token && role === req.token.role) {
      console.log (req.token)
      next();
    } else {
      res
        .status(403)
        .json({ message: `You have no power here, you must be an ${role}` });
    }
  };
}

//SESSION/COOKIE//
// router.post("/login", (req, res) => {
//     let { username, password } = req.body;
  
//     // check that the password
  
//     Users.findBy({ username })
//       .first()
//       .then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//           req.session.user = user;
//           res.status(200).json({ message: `Welcome ${user.username}, have a cookie!` });
//         } else {
//           res.status(401).json({ message: "Invalid Credentials" });
//         }
//       })
//       .catch(error => {
//         res.status(500).json(error);
//       });
//   });

//BEFORE CHANGING TO SESSION//
// router.post("/login", (req, res) => {
//   let { username, password } = req.body;

//   // check that the password

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         // in here with .compare()
//         // change the users-model findBy() to return the password as well
//         res.status(200).json({ message: `Welcome ${user.username}!` });
//       } else {
//         res.status(401).json({ message: "Invalid Credentials" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

router.get("/",restricted, (req, res) => {
    Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get users' });
    });
  });

//BEFORE CHANGING TO SESSION//
// function restricted(req,res,next) {
//     let { username, password } = req.headers;

// if(username && password) {    
//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         next();
//       } else {
//         res.status(401).json({ message: "Invalid Credentials" });
//       }
//     })
//     .catch(err => {
//         res.status(500).json({ message: 'Error' });
//       });
//  } else { res.status(400).json({ message: 'Provide username and password' });}    
// }  

//LOGOUT FROM SESSION//
// router.get("/logout", (req, res) => {
//     if (req.session) {
//       req.session.destroy(error => {
//         if (error) {
//           res.status(500).json({
//             message:
//               "you can checkout any time you like, but you can never leave!!!!!",
//           });
//         } else {
//           res.status(200).json({ message: "logged out" });
//         }
//       });
//     } else {
//       res.status(200).end();
//     }
//   });

module.exports = router;