const mongoose = require('mongoose');
//require('mongoose-currency').loadType(mongoose);

// const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;


const LeadersSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    
    image:{
        type:String,
        required:true
    },

    designation:{
        type: String,
        required: true
    },

    abbr:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },
    
    featured:{
        type: Boolean,
        default:false
    }
    
});

const Leaders = mongoose.model('Leader', LeadersSchema);

module.exports = Leaders;