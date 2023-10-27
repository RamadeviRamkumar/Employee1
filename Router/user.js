let router = require('express').Router();
const Cryptr = require('cryptr');
var cryptr = new Cryptr('Employee')
const nodemailer = require("nodemailer");
const generateToken = require("../utils/utils.js");
const verifyToken = require("../middleware/middleware.js");
const bcrypt = require("bcryptjs");

router.get('/read',function(req,res){
    res.json({
        Status: 'API works',
        message:"Welcome to signin Page",
    })
});
const Signup = require('../model/model.js');
router.post("/signin", async (req, res) => {
  try {
    const { Empname, Password } = req.body;

    const users = await Signup.findOne({ Empname });

    if (!users) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const decryptedPassword = cryptr.decrypt(users.Password);

    if (decryptedPassword === Password) {
      return res.json({
        message: "Signin successful",
        data: users,
      });
    } else {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
      
    });
  }
});

// const Signup = require('../model/model.js');

router.post("/authenticate", async (req, res) => {
    const { Empname, password } = req.body;
    const user = await Signup.findOne({ Empname });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const token = generateToken(user);
    res.json({ token });
  });
  
  router.post("/data", verifyToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.Empemail}! This is protected data` });
  });
  router.post("/reset", async (req, res) => {
      const { Empemail } = req.body;
    
      const user = await User.findOne({ Empemail });
    
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      const token = Math.random().toString(36).slice(-8);
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 360000; //1hour
    
      await user.save();
    
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ramdevcse25@gmail.com",
          password: "qcdw lqyf pjwu jfhc",
        },
      });
      const message = {
        from: "ramdevcse25@gmail.com",
        to: user.email,
        subject: "password reset request",
        text: `You are receiving this email because you (or someone else) has requested a password reset for your account. \n\n please use the following token to reset your password:${token} \n\n if you did not request a password reset,please ignore this email`,
      };
      transporter.sendMail(message, (err, info) => {
        if (err) {
          res.status(404).json({ message: "Something went wrong,Try again!" });
        }else{
        res.status(200).json({ message: "Password reset Email send" + info.response });
        }
      });
      
    });
  router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
  
    await user.save();
  
    res.json({ message: "Password reset Successful" });
  });
  
  

const emailcount = require ('../model/model.js');

router.post('/signup',async(req,res)=> {
    var cryptr = new Cryptr('Employee');
    var enc = cryptr.encrypt(req.body.Password);
    // var dec = cryptr.decrypt(enc);
    
    var user = new Signup();
    user.Empname = req.body.Empname;
    user.Empemail = req.body.Empemail;
    user.Phonenumber = req.body.Phonenumber;
    user.Password =enc ;
    try{
       await user.save();
       res.status(201).json({
        message : "New User Signup Successfully",
        data:{
            Empname : req.body.Empname,
            Empemail : req.body.Empemail,
            Phonenumber : req.body.Phonenumber,
            Password : enc,
        },
       });
    } catch(err) {
        res.status(400).json({
            message : "User Already Signed up with this email",
            error : err.message,
        });
    }
});

var controller = require('../controller/handle.js');
router.route('/getall')
.get(controller.index)
router.route('/update').put(controller.update)

router.route('/getall/:Empemail')
.get(controller.view)
.patch(controller.update)
.put(controller.update)
.delete(controller.Delete);

module.exports = router;


    
