import User from "../models/user";
import Stripe from 'stripe';
import queryString from "query-string";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
  // console.log(req.user);

  const user = await User.findById(req.user._id).exec()
  console.log(user);

  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "standard",
    });
    console.log("ACCOUNT===>", account);
    user.stripe_account_id =account.id;
    user.save();
  }

  let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: 'account_onboarding'

  });
  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email || undefined,
  });
  console.log("ACCOUNT LINK", accountLink);
  let link=`${accountLink.url}?${queryString.stringify(accountLink)}`;
  console.log('LOGIN LINK',link);
  res.send(link)
};

// const updateDelayDays =async (accountId)=>{
//      const account =await stripe.accounts.update(accountId,{
//        settings:{
//          payouts:{
//            schedule:{
//             delay_days:7,
//            },
//          },
//        },
//      });
//      return account;
// }
export const getAccountStatus =async (req,res)=>{
  console.log("GET ACCOUNT STATUS");
  const user = await User.findById(req.user._id).exec()

  const account = await stripe.accounts.retrieve(user.stripe_account_id);

  // console.log("USER ACCOUNT RETRIEVE",account);
  // const updatedAccount=await updateDelayDays(account.id);

  const updateUser=await User.findByIdAndUpdate(
   
    user._id,
    {
      stripe_seller: account,
    },
    {new:true}
  ).select("-password")
    .exec();

    // console.log(updateUser);
    res.json(updateUser);
};


export const getAccountBalance =async (req,res)=>{
  const user = await User.findById(req.user._id).exec();
  try{
    const balance = await stripe.balance.retrieve({
      stripeAccount:user.stripe_account_id,
    });
    // console.log("BALANCE",balance);
    res.json(balance);
  }catch(err)
  {
    console.log(err);
  }

};

export const payoutSetting =async(req,res)=>{
  try{
    const user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      {
           redirect_url:process.env.STRIPE_SETTING_REDIRECT_URL,
      }
     );
    console.log("LOGIN LINK FOR PAYOUT SETTING",loginLink);
    res.json(loginLink);
  }catch(err)
  {
    console.log("STRIPE PAYOUT SETTING ERR",err);
  }
}