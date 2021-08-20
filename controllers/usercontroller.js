const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { UserModel } = require('../models');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    let {username, passwordhash} = req.body.user;
 try{
    const User = await UserModel.create({
        username,
        passwordhash: bcrypt.hashSync(passwordhash, 13),
    });
    
    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
    
    res.status(201).json({
        message: 'Registration Succesful',
        user: User,
        sessionToken: token
    });
 } catch (err) {
     if (err instanceof UniqueConstraintError) {
         res.status(409).json({
             message: "Username already exists",
         })
     } else {
     res.status(500).json({
         message: "Registration Failed",
     });
     }
 }
});

router.post("/login", async (req, res) => {
    let { username, passwordhash } = req.body.user;

    try{
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });

        if (loginUser) {
        
        let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash)
        
        if (passwordComparison) {
        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});    
        
        res.status(200).json({
            user: loginUser,
            message: 'Login succesful',
            sessionToken: token
        });
    } else {
        res.status(401).json({
            message: "incorrect Username or Password Hash"
        })
    }

    } else {
        res.status(401).json({
            message: 'incorrect Username or Password Hash'
        });
    }
    }   catch (error) {
        res.status(500).json({
            message: "Login Failed"
        })
    }
});



module.exports = router;