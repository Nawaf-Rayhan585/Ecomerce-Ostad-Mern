const mongoose = require("mongoose");
const CartModel = require("../models/CartModel");
const ProfileModel = require("../models/ProfileModel");
const InvoiceModel = require("../models/InvoiceModel");
const InvoiceProductModel = require("../models/InvoiceProductModel");
const PaymentSettingModel = require("../models/PaymentSettingModel");
const ObjectID=mongoose.Types.ObjectId
const FormData = require('form-data');
const axios = require("axios");



const CreateInvoiceService = async (req) => {


let user_id = new ObjectID(req.headers.user_id)
let cus_email = req.headers.email


// =============Step 01: Calculate Total Payable & Vat=====================================================================================

let matchStage={$match:{userID:user_id}}
let JoinStageProduct={$lookup:{from:'products',localField:'productID',foreignField:'_id',as:'product'}}
let unwindStage={$unwind:'$product'}

let CartProducts = await CartModel.aggregate([matchStage, JoinStageProduct,unwindStage])

let totalAmount = 0;
CartProducts.forEach((element) => {
    let price;
    if(element['product']['discountPrice']) {
        price = parseFloat(element['product']['discountPrice'])
    } else {
        price = parseFloat(element['product']['price'])
    }
    totalAmount += parseFloat(element['qty'])*price

})

let vat = totalAmount * 0.05  //5% Vat
let payable = totalAmount + vat



// =============Step 02: Prepare  Customer Details & Shipping Details=====================================================================================


let Profile = await ProfileModel.aggregate([matchStage])
let cus_details = `Name:${Profile[0]['cus_name']} , Email:${cus_email} ,Address:${Profile[0]['cus_add']} ,Phone:${Profile[0]['cus_phone']}`;
let ship_details = `Name:${Profile[0]['ship_name']} , City:${Profile[0]['ship_city']} ,Address:${Profile[0]['ship_add']} ,Phone:${Profile[0]['ship_phone']}`;


// =============Step 03: Transaction & Other's ID=====================================================================================


let tran_id=Math.floor(10000000+Math.random()*90000000);
let val_id = 0
let delivery_status = 'pending'
let payment_status = 'pending'


// =============Step 04: Create Invoice=====================================================================================


    let createInvoice = await InvoiceModel.create({


        userID:user_id,
        payable:payable,
        cus_details:cus_details,
        ship_details:ship_details,
        val_id:val_id,
        tran_id:tran_id,
        delivary_status:delivery_status,
        payment_status:payment_status,
        total:totalAmount,
        vat:vat,


    })


// =============Step 05: Create Invoice Product=====================================================================================

let invoice_id = createInvoice['_id'];

CartProducts.forEach(async (element) => {

    await InvoiceProductModel.create({

        userID:user_id,
        productID:element['productID'],
        invoiceID:invoice_id,
        qty:element['qty'],
        price:element['product']['discount']?element['product']['discountPrice']:element['product']['price'],
        color:element['color'],
        size:element['size']
    })

})


//=============Step 06: Remove Carts=====================================================================================


await CartModel.deleteMany({userID:user_id});


//===============Step 07: Prepare ssl payment======================================================================
let PaymentSettings=await PaymentSettingModel.find();


    const form=new FormData();
    form.append('store_id',PaymentSettings[0]['store_id'])
    form.append('store_passwd',PaymentSettings[0]['store_passwd'])
    form.append('total_amount',payable.toString())
    form.append('currency',PaymentSettings[0]['currency'])
    form.append('tran_id',tran_id)

    form.append('success_url',`${PaymentSettings[0]['success_url']}/${tran_id}`)
    form.append('fail_url',`${PaymentSettings[0]['fail_url']}/${tran_id}`)
    form.append('cancel_url',`${PaymentSettings[0]['cancel_url']}/${tran_id}`)
    form.append('ipn_url',`${PaymentSettings[0]['ipn_url']}/${tran_id}`)

    form.append('cus_name',Profile[0]['cus_name'])
    form.append('cus_email',cus_email)
    form.append('cus_add1',Profile[0]['cus_add'])
    form.append('cus_add2',Profile[0]['cus_add'])
    form.append('cus_city',Profile[0]['cus_city'])
    form.append('cus_state',Profile[0]['cus_state'])
    form.append('cus_postcode',Profile[0]['cus_postcode'])
    form.append('cus_country',Profile[0]['cus_country'])
    form.append('cus_phone',Profile[0]['cus_phone'])
    form.append('cus_fax',Profile[0]['cus_phone'])

    form.append('shipping_method',"YES")
    form.append('ship_name',Profile[0]['ship_name'])
    form.append('ship_add1',Profile[0]['ship_add'])
    form.append('ship_add2',Profile[0]['ship_add'])
    form.append('ship_city',Profile[0]['ship_city'])
    form.append('ship_state',Profile[0]['ship_state'])
    form.append('ship_country',Profile[0]['ship_country']),
    form.append('ship_postcode',Profile[0]['ship_postcode'])

    form.append('product_name','According Invoice')
    form.append('product_category','According Invoice')
    form.append('product_profile','According Invoice')
    form.append('product_amount','According Invoice')

    let SSLRes = await axios.post(PaymentSettings[0]['init_url'],form)


    console.log(form)
    return {status:'success',data:SSLRes.data}

}


const PaymentSuccessService = async (req)=>{
    try{
        let trx_id = req.params
        return {status:"success"}
    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
}

const PaymentFailService = async (req)=>{
    try{
        return {status:"fail"}
    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
}

const PaymentCancelService = async (req)=>{
    try{
        return {status:"cancel"}
    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
}





const PaymentIPNService = async (req)=>{
    try{
        return {status:"success"}
    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
}





const InvoiceListService = async (req)=>{
    try{
        let user_id=req.headers.user_id;

    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
}



const InvoiceProductListService = async (req)=>{
   try{

        return {status:"success",data: products}
    }catch (e) {
        return {status:"fail", message:"Something Went Wrong"}
    }
}




module.exports={
    CreateInvoiceService,
    PaymentFailService,
    PaymentCancelService,
    PaymentIPNService,
    PaymentSuccessService,
    InvoiceListService,
    InvoiceProductListService
}
