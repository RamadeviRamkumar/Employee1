const Cryptr = require('cryptr');
const Signup = require('../model/model.js');

exports.Dao_index = async function (req, res) {
  try {
    const users = await Signup.find();

    if (users ) {
      res.json({
        status: "Success",
        message: "Got all user details Successfully",
        data: users
      });
    } else {
      res.json({
        status: "Error",
        message: "No users found"
      });
    }
  } catch (err) {
    res.json({
      status: "Error",
      message: err.message
    });
  }
};
exports.Dao_view = async function (req, res) {
  try {
    const users = await Signup.find({ Empemail: req.params.Empemail });
    res.json({
      message: "User Signup Details",
      data: users
    });
  } catch (err) {
    res.send(err);
  }
};
exports.view = async (req, res) => {
  try {
    const staff = await Service.Service_view(req.params.user_id);
    if (!staff) {
      return res.json({
        status: "Error",
        message: "Staff  id not found",
      });
    }
    res.json({
      status: "Success",
      message: "staff leaverequest details GET by _id successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.Dao_update = async function (req, res) {
  try {
    const user = await Signup.findOne({ Empemail: req.params.Empemail });
    if (!user) {
      return res.json({
        status: "Error",
        message: "User not found"
      });
    }
   
    user.Empname = req.body.Empname;
    user.Empemail = req.body.Empemail;
    user.Phonenumber = req.body.Phonenumber;
        user.password = enc;

    await user.save();
    res.json({
      message: "*** User details updated successfully ***",
      data: user
    });
  } catch (err) {
    res.json({
      status: "Error",
      message: err
    });
  }
};

exports.Dao_Delete = async function (req, res) {
  try {
    const user = await Signup.deleteOne({ Empemail: req.params.Empemail });
    res.json({
      status: "Success",
      message: "*** User Deleted Successfully ***",
      data: user
    });
  } catch (err) {
    res.json({
      status: "Error",
      message: err
    });
  }
};
