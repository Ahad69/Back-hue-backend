const express = require("express");
const { Webhook } = require("coinbase-commerce-node");
const { increaseUserCredit } = require("../users/services");
const { Transactions } = require("../models");
const router = express.Router();

router.post("/", async (req, res) => {

    const rawBody = req.rawBody;
    const signature = req.headers['x-cc-webhook-signature'];
    const webhookSecret = process.env.WEBHOOK_TOKEN;
    try {
        const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

        if (event.type === 'charge:confirmed') {
       
            const user_id = event.data.metadata.user_id;
            const amount = event.data.pricing.local.amount;

            const date = new Date().toDateString();
            const isCompleted = "Done"
            const invoice =
            Math.floor(Math.random() * 500) * 10 +
            user_id +
            Math.floor(Math.random() * 500) * 10;

            const transaction = {
                amount,
                date,
                invoice,
                isCompleted,
                userId : user_id,
                isDelete: false,
                
              };

            const newTransaction =  new Transactions(transaction);
            await newTransaction.save();
            await increaseUserCredit(user_id, parseFloat(amount));
        }

        res.send(`success ${event.id}`);
        
    } catch (error) {
        console.log(error);
        res.status(400).send('failure!');
    }
});



module.exports = router;