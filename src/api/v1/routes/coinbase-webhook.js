const express = require("express");
const { Webhook } = require('coinbase-commerce-node');
const { increaseUserCredit } = require("../users/services");
const router = express.Router();

router.post("/", async (req, res) => {
    const rawBody = req.rawBody;
    const signature = req.headers['x-cc-webhook-signature'];
    const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

    try {
        const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
        const user_id = event.data.metadata.user_id;
        console.log({ user_id, amount : event.data.local_price.amount })
        await increaseUserCredit(user_id, event.data.local_price.amount)

        if (event.type === 'charge:pending') {
            // TODO
            // user paid, but transaction not confirm on blockchain yet
        }

        if (event.type === 'charge:confirmed') {
            increaseUserCredit(user_id, event.data.local_price.amount)
        }

        if (event.type === 'charge:failed') {
            // TODO
            // charge failed or expired
        }

        res.send(`success ${event.id}`);
    } catch (error) {
        console.log(error);
        res.status(400).send('failure!');
    }
});

module.exports = router;
