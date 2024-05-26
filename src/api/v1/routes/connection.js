const { Spot } = require("@binance/connector");

const router = require("express").Router();

const apiKey =
  "oN3SWU2DwXjT8dSVmLPzQpkIzjat70WTejDlWPO4Dycy11mTvqJ3LffLtwnmU64D";
const apiSecret =
  "mHVcRCGsvCHwcCDfZg46I1BbBnYIEG7woN8iY48Zwe0yUXfhZP7vFGIfDe0PzoB9";
const client = new Spot(apiKey, apiSecret);

router.post("/", async (req, res) => {
  //  client.account().then((response) => client.logger.log(response.data));
  const clients = await client.account();

  console.log("Account Info:", clients);

  // Place a new order
  //  client
  //    .newOrder("BNBUSDT", "BUY", "LIMIT", {
  //      price: "350",
  //      timeInForce: "GTC",
  //    })
  //    .then((response) => client.logger.log(response.data))
  //    .catch((error) => client.logger.error(error));
});

module.exports = router;
