import express from 'express';

const router =express.Router();

import {createConnectAccount,getAccountStatus,getAccountBalance,payoutSetting} from '../controllers/stripe';
import { requireSignin } from '../middlewares';


router.post('/create-connect-account',requireSignin,createConnectAccount);
router.post('/get-account-status',requireSignin,getAccountStatus);
router.post('/get-account-balance',requireSignin,getAccountBalance);
router.post('/payout-setting',requireSignin,payoutSetting);

module.exports = router;