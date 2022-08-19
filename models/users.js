const mongoose = require('mongoose');
var Schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');

var User=new Schema ({
    firstname:{
        type :String,
        dafault :" "
    },
    lastname:{
        type :String,
        dafault :" "
    },
    admin: {
        type:Boolean,
        default: false
    }
},{
    timestamps:true
     
});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);