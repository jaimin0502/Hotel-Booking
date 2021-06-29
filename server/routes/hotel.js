import express from 'express';
import formidable from 'express-formidable';


const router =express.Router();

import {create,hotels,image,sellerHotels} from '../controllers/hotel';
import { requireSignin } from '../middlewares';


router.post('/create-hotel',requireSignin,formidable(), create);

router.get('/hotels',hotels);
router.get("/hotel/image/:hotelId",image);
router.get('/seller-hotels',requireSignin,sellerHotels);

module.exports = router;