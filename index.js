const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'b2637fe72f618333ce1c0326b09c526e37c785be585695f5617a2e95ac96cf8f8a4d39749b257d3bf1c52e356e8b0486c5f3d60fc3aaab0cb573fe9d0787f6b1';


const User = require('./model/user');
const bcrypt = require('bcrypt');
const app = express();
const uri ='mongo_uri';
const cookieParser = require('cookie-parser');

app.use(cookieParser('yes'));
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/build'))

const auth = (req,res,next) => {
    
    const token = req.signedCookies['x-auth-token'];
    if(!token) return res.status(401).json({msg:'Authorization denied'});
        
    try {
        const decode = jwt.verify(token,JWT_SECRET);
        req.user = decode;
        next();
    } catch(e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

app.post('/register',async (req,res) =>{
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    try {
        if(!username) throw Error("Enter Username");
        if(!email) throw Error("Enter Email");
        if(!password) throw Error("Enter Password");
        const checkEmail = await User.findOne({email:email});
        if (checkEmail) throw Error('Email already exists');

        const checkUser = await User.findOne({username:username});
        if (checkUser) throw Error('User already exists');

        if(password.length < 8) throw Error('Password should be atleast 8 char long');
        var salt = await bcrypt.genSalt(10);
        var passHash = await bcrypt.hash(password,salt);
        const savedUser = await User.create({username,email,password:passHash});    

        const token = jwt.sign({id:savedUser._id},JWT_SECRET,{expiresIn:'1h'});
        if (!token) throw Error('Couldnt sign the token');

        res.cookie('x-auth-token', token ,{
            maxAge: 1000 * 60 * 60, 
            httpOnly: true, 
            signed: true,
            //secure:true,
        })
        res.status(200).json({msg : 'Account created Succesfull',error :false});
         
    } catch(e) {
        res.status(200).json({msg : e.message,error :true});
    } 
     
})

app.post('/login',async (req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    try {
        if(!email) throw Error("Enter Email");
        if(!password) throw Error("Enter Password");
        var userInfo = await User.findOne({email:email});
        if(!userInfo) throw Error("Invalid Email");

        var success = await bcrypt.compare(password,userInfo.password);
        if(!success) throw Error("Invalid Password");

        const token = jwt.sign({id:userInfo._id},JWT_SECRET,{expiresIn:'1h'});
        if (!token) throw Error('Couldnt sign the token');

        res.cookie('x-auth-token', token ,{
            maxAge: 1000 * 60 * 60, 
            httpOnly: true, 
            signed: true,
            //secure:true
        })
        res.status(200).send({msg:'Login successfully',error:false});
        
        
      
    } catch(e) {
        res.status(200).send({msg:e.message,error:true});
    }
})

app.get('/home',auth,(req,res) => {
    res.send({text:'Hello world on the home page'});
})

app.post('/logout',auth,(req,res) => {
    res.clearCookie('x-auth-token');
    res.send({text:'Logout successfully'});
})

app.listen(5000,async () =>{
    console.log('Server started...');
    try {
        await mongoose.connect(uri,{
            useUnifiedTopology :true,
            useCreateIndex : true,
            useNewUrlParser : true
        });
        console.log('Database Connected...');
    } catch(e) {
        console.log('Database error');
    }
})

