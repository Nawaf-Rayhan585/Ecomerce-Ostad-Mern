const BrandModel = require('../models/BrandModel')
const CategoryModel = require('../models/CategoryModel')
const ProductSliderModel = require('../models/ProductSliderModel')
const ProductModel = require('../models/ProductModel')
const ProductDetailsModel = require('../models/ProductDetailsModel')
const ReviewModel = require('../models/ReviewModel')
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const BrandListService = async () => {
    try {
        let data = await BrandModel.find();
        return { status: 'success', data: data };
    } catch (e) {
        return { status: 'fail', data:e}.toString(); // Keep the error as a message
    }
};



const CategoryListService = async () => {
    try {
        let data = await CategoryModel.find();
        return {status:'success' , data:data}
     } catch (e) {
         return {status:'fail' , data:e}.toString()
     }
}
const SliderListService = async () => {
    try {
        let data = await ProductSliderModel.find();
        return {status:'success' , data:data}
     } catch (e) {
         return {status:'fail' , data:e}.toString()
     }
}

//Similar

const ListByBrandService = async (req) => {
    try {
        

        let BrandID =new ObjectId(req.params.BrandID);
        let MatchStage = {$match:{brandID:BrandID}};
        let JoinWithBrandStage = {$lookup:{from:"brands" , localField:"brandID" , foreignField:"_id", as:"brand"}};
        let JoinWithCategoryStage = {$lookup:{from:"categories" , localField:"categoryID" , foreignField:"_id", as:"category"}};
        let UnwindBrandStage={$unwind:"$brand"}
        let UnwindCategoryStage={$unwind:"$category"}
        
        let ProjectionStage={$project:{'brand._id':0 , 'category._id':0 ,'categoryID':0 , 'brandID':0}}
    
        
    
        let data = await ProductModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage,UnwindCategoryStage,ProjectionStage
        ])
    
        return {status:'success' , data:data}
    
    
        } catch (e) {
            return {status:'fail' , data:e}.toString()
        }
}
const ListByCategoryService = async (req) => {
    try {
        

        let CategoryID =new ObjectId(req.params.CategoryID);
        let MatchStage = {$match:{categoryID:CategoryID}};

        
        let JoinWithBrandStage = {$lookup:{from:"brands" , localField:"brandID" , foreignField:"_id", as:"brand"}};
        let JoinWithCategoryStage = {$lookup:{from:"categories" , localField:"categoryID" , foreignField:"_id", as:"category"}};
        let UnwindBrandStage={$unwind:"$brand"}
        let UnwindCategoryStage={$unwind:"$category"}
        
        let ProjectionStage={$project:{'brand._id':0 , 'category._id':0 ,'categoryID':0 , 'brandID':0}}
    
        
    
        let data = await ProductModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage,UnwindCategoryStage,ProjectionStage
        ])
    
        return {status:'success' , data:data}
    
    
        } catch (e) {
            return {status:'fail' , data:e}.toString()
        }
}
const ListByRemarkService = async (req) => {
    try {
        

        let Remark =(req.params.Remark);
        let MatchStage = {$match:{remark:Remark}};
        let JoinWithBrandStage = {$lookup:{from:"brands" , localField:"brandID" , foreignField:"_id", as:"brand"}};
        let JoinWithCategoryStage = {$lookup:{from:"categories" , localField:"categoryID" , foreignField:"_id", as:"category"}};
        let UnwindBrandStage={$unwind:"$brand"}
        let UnwindCategoryStage={$unwind:"$category"}
        
        let ProjectionStage={$project:{'brand._id':0 , 'category._id':0 ,'categoryID':0 , 'brandID':0}}
    
        
    
        let data = await ProductModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage,UnwindCategoryStage,ProjectionStage
        ])
    
        return {status:'success' , data:data}
    
    
        } catch (e) {
            return {status:'fail' , data:e}.toString()
        }
}

//Similar

const ListBySimilierService = async (req) => {
    try {
        
        let CategoryID =new ObjectId(req.params.CategoryID);
        let MatchStage = {$match:{categoryID:CategoryID}};
        
        
        let JoinWithBrandStage = {$lookup:{from:"brands" , localField:"brandID" , foreignField:"_id", as:"brand"}};
        let JoinWithCategoryStage = {$lookup:{from:"categories" , localField:"categoryID" , foreignField:"_id", as:"category"}};
        let UnwindBrandStage={$unwind:"$brand"}
        let UnwindCategoryStage={$unwind:"$category"}
        
        let ProjectionStage={$project:{'brand._id':0 , 'category._id':0 ,'categoryID':0 , 'brandID':0}}
    
        
    
        let data = await ProductModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage,UnwindCategoryStage,ProjectionStage
        ])
    
        return {status:'success' , data:data}
    
    
    } catch (e) {
        return {status:'fail' , data:e}.toString()
    }
}

const DetailsService = async (req) => {
    try {
    let ProductID =new ObjectId(req.params.ProductID);
    let MatchStage = {$match:{_id:ProductID}};

    let JoinWithBrandStage = {$lookup:{from:"brands" , localField:"brandID" , foreignField:"_id", as:"brand"}};
    let JoinWithCategoryStage = {$lookup:{from:"categories" , localField:"categoryID" , foreignField:"_id", as:"category"}};
    let JoinWithDetailsStage = {$lookup:{from:"productdetails" , localField:"_id" , foreignField:"productID", as:"details"}};


    let UnwindBrandStage={$unwind:"$brand"}
    let UnwindCategoryStage={$unwind:"$category"}
    let UnwindDetailsStage={$unwind:"$details"}


    let ProjectionStage={$project:{'brand._id':0 , 'category._id':0 ,'categoryID':0 , 'brandID':0}}



    let data = await ProductModel.aggregate([
        MatchStage,
        JoinWithBrandStage,
        JoinWithCategoryStage,
        JoinWithDetailsStage,
        UnwindBrandStage,
        UnwindCategoryStage,
        UnwindDetailsStage,
        ProjectionStage,
    ])

    return {status:'success' , data:data}
    } catch (e) {
        return {status:'fail' , data:e}.toString()
    }
}

const ListByKeywordService = async (req) => {


    try {
        
        let SearchRegex={"$regex":req.params.Keyword , "$options":"i"}
        let SearchParams=[{title:SearchRegex},{shortDes:SearchRegex}]
        let SearchQuery = {$or:SearchParams}
    
        let MatchStage = {$match:SearchQuery};
    
        let JoinWithBrandStage = {$lookup:{from:"brands" , localField:"brandID" , foreignField:"_id", as:"brand"}};
        let JoinWithCategoryStage = {$lookup:{from:"categories" , localField:"categoryID" , foreignField:"_id", as:"category"}};
        let UnwindBrandStage={$unwind:"$brand"}
        let UnwindCategoryStage={$unwind:"$category"}
            
        let ProjectionStage={$project:{'brand._id':0 , 'category._id':0 ,'categoryID':0 , 'brandID':0}}
    
    
        let data = await ProductModel.aggregate([
            MatchStage,
            JoinWithBrandStage,
            JoinWithCategoryStage,
            UnwindBrandStage,
            UnwindCategoryStage,
            ProjectionStage
        ])
        console.log(data)
        return {status:'success' , data:JSON.stringify(data)}




    } catch (e) {
        
        return {status:'fail' , data:e}.toString()


    }


}

const ReviewListService = async () => {
    
}

module.exports = {
    BrandListService,
    CategoryListService,
    SliderListService,
    ListByBrandService,
    ListByCategoryService,
    ListBySimilierService,
    ListByKeywordService,
    ListByRemarkService,
    DetailsService,
    ReviewListService,
}