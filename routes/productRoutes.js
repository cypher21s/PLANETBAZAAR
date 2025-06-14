import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { braintreePaymentController, braintreeTokenContoller, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterscontroller, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js"
import formidable from 'express-formidable'

const router = express.Router()

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(),createProductController)
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(),updateProductController)
router.get('/get-product', getProductController)
// single product route
router.get("/get-product/:slug", getSingleProductController)
// get photo
router.get("/product-photo/:pid", productPhotoController)
// delete product
router.get('/delete-product/:pid',deleteProductController)
// filter product
router.post('/product-filters', productFilterscontroller)
// product count
router.get('/product-count', productCountController)
// product per page
router.get('/product-list/:page',productListController)

// search product
router.get('/search/:keyword', searchProductController)
// similar product
router.get('/related-product/:pid/:cid', relatedProductController)
// category wise product
router.get('/product-category/:slug',productCategoryController)

// payment routes
// token
router.get('/braintree/token', braintreeTokenContoller)
// payment
router.post('/braintree/payment',requireSignIn,braintreePaymentController)


export default router