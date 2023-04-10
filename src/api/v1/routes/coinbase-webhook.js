const express = require("express");
const { Webhook } = require("coinbase-commerce-node");
const { increaseUserCredit } = require("../users/services");
const { updatedTransactionStatus } = require("../transaction/services");
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
            const isCompleted = "done"
            await increaseUserCredit(user_id, parseFloat(amount))
            await updatedTransactionStatus(user_id, isCompleted)
        }

        res.send(`success ${event.id}`);
    } catch (error) {
        console.log(error);
        res.status(400).send('failure!');
    }
});



module.exports = router;