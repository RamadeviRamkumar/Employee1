var mongoose = require ('mongoose');

var Schema = mongoose.Schema ({
    Empname :{
        required : true,
        type : String
    },
    Empemail : {
        required : true,
        type : String
    },
    Phonenumber : {
        required : true,
        type : Number
    },
    Password : {
        required : false,
        type : String
    },
    created_at : {
        type : Date,
        default : Date.now
    },
})
Schema.path('Empemail').validate(async (Empemail) =>{
    const emailCount = await mongoose.models.Details.countDocuments({ Empemail })
    return !emailCount
  },'EmpEmail already exists');
  
  var Signup = module.exports = mongoose.model('Details',Schema);
module.exports.get = function(callback, limit) {
    Signup.find(callback).limit(limit);
};