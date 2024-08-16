const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();


//Product Related Routeing (Routes)

router.get('/ProductBrandList' , ProductController.ProductBrandList)
router.get('/ProductSliderList' , ProductController.ProductSliderList)
router.get('/ProductCategoryList' , ProductController.ProductCategoryList)
router.get('/ProductListByBrand/:BrandID' , ProductController.ProductListByBrand)
router.get('/ProductListByCategory/:CategoryID' , ProductController.ProductListByCategory)
router.get('/ProductListBySmilier/:CategoryID' , ProductController.ProductListBySmilier)
router.get('/ProductListByKeyword/:Keyword' , ProductController.ProductListByKeyword)
router.get('/ProductListByRemark/:Remark' , ProductController.ProductListByRemark)
router.get('/ProductReviewList/:ProductID' , ProductController.ProductReviewList)
router.get('/ProductDetails/:ProductID' , ProductController.ProductDetails)

//-----------#########-----([O])-----########------------/






module.exports = router;