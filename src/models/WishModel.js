
const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({

    userID:{type:mongoose.Schema.Types.ObjectId , required:true},
    productID:{type:mongoose.Schema.Types.ObjectId , required:true},

},
{timestamp:true , versionKey:false}
)


const WishModel = mongoose.model('wishes' , DataSchema)
module.exports = WishModel