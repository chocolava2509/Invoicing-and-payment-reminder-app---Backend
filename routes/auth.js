const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const{registerValidation,loginValidation}= require('../validation')

router.post('/regiter',async(req,res)=>{
    //// Validate the data before a user is created
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.detais[0].message)

    //checking if the user is already in the database
    const EmailExist = await User.findone({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //hash password
    const salt = new user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        //res.send(savedUser);sends all the info of the saved user
        res.send({user:user._id})
    }catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login',async(req,res)=>{
    const{error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the email exist
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //create and assign a token 
    const token  = jwt.sign ({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
});

module.exports = router;