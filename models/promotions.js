const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const promoSchema = new Schema({
    name: {
        type: String,
        required:true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        defalut : ''
    },
    price : {
        type: Currency,
        required : true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
 
},  
{
        timestamps: true
});

// module name = mongoose.model('modle_name',dishSchema_it_has_used);
// here modle_name 'Dish' automatically pluralize to Dishes  
var Promos = mongoose.model('Promo', promoSchema);

module.exports = Promos;