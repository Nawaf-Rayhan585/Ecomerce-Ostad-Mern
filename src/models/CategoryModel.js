
const mongoose = require('mongoose');

const DataSchema = mongoose.Schema({
    categoryName:{type:String,unique:true, required:true},
    categoryImg:{type:String,unique:true, required:true}
},
{timestamp:true , versionKey:false}
)


const CategoryModel = mongoose.model('categories' , DataSchema)

module.exports = CategoryModel