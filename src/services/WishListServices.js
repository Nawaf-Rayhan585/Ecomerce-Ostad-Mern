const WishModel = require("../models/WishModel");
const mongoose = require("mongoose");
const ObjectID=mongoose.Types.ObjectId

const WishListService = async (req) => {

    try {
    
        let user_id=new ObjectID(req.headers.user_id);
        let matchStage = {$match:{userID:user_id}}
        let joinStageProduct = {$lookup:{from:'products',localField:'productID',foreignField:'_id',as:'product'}}
        let unwindProductStage = {$unwind:'$product'}
        let joinStageBrand = {$lookup:{from:'brands',localField:'product.brandID',foreignField:'_id',as:'brand'}}
        let unwindBrandStage = {$unwind:'$product'}
        let joinStageCategory = {$lookup:{from:'categories',localField:'product.categoryID',foreignField:'_id',as:'category'}}
        let unwindCategoryStage = {$unwind:'$category'}
        let projectionStage = {$project:{'_id':0,'user_id':0,'createdAt':0,'updatedAt':0,'product._id':0,'product.categoryID':0,'product.brandID':0,'brand._id':0,'category._id':0}}
        let data=await WishModel.aggregate([
            
            matchStage,
            joinStageProduct,
            joinStageBrand,
            unwindProductStage,
            unwindBrandStage,
            joinStageCategory,
            unwindCategoryStage,
            projectionStage
        ])
        

        return {status:"success",data:data}

    }catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}









const SaveWishListService = async (req) => {
    try {
        let user_id=req.headers.user_id;
        let reqBody=req.body;
        reqBody.userID=user_id;
        await WishModel.updateOne(reqBody,{$set:reqBody},{upsert:true})
        return {status:"success",message:"Wish List Save Success"}
    }
    catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}


const RemoveWishListService = async (req) => {
    try {
        let user_id=req.headers.user_id;
        let reqBody=req.body;
        reqBody.userID=user_id;
        await WishModel.deleteOne(reqBody)
        return {status:"success",message:"Wish List Remove Success"}
    }
    catch (e) {
        return {status:"fail",message:"Something Went Wrong !"}
    }
}


module.exports={
    WishListService,
    SaveWishListService,
    RemoveWishListService
}