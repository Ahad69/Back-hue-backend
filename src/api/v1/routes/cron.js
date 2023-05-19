const cron = require("node-cron");
const { Product } = require("../models");

const updateDataStatus = async () => {
  const validate = await Product.find({ 
    $and: [
      { isDelete : false },
      { premiumDay : {  $gt: 0  } },
      { $project : {name : 1 , premiumDay : 1 , isPremium : 1}}
   ]
   });

  const minus = validate.map(async(a) => {
    a.premiumDay = a.premiumDay - 12;
    if (a.premiumDay == 0) {
      a.isPremium = true;
    }
    await a.save();
    
  });
};

cron.schedule("*/2 * * * *", () => {
  updateDataStatus();
    console.log("ahad")
});