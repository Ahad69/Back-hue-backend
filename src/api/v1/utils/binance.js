const crypto = require("crypto");
const axios = require("axios");
const config = require("./config");

const BASE_URL = "https://api.binance.com";

function createSignature(queryString, secretKey) {
  return crypto
    .createHmac("sha256", secretKey)
    .update(queryString)
    .digest("hex");
}

async function binanceRequest(method, endpoint, data) {
  const queryString = Object.keys(data)
    .map((key) => `${key}=${encodeURIComponent(data[key])}`)
    .join("&");
  const signature = createSignature(queryString, config.binanceSecretKey);
  const url = `${BASE_URL}${endpoint}?${queryString}&signature=${signature}`;

  const headers = {
    "X-MBX-APIKEY": config.binanceApiKey,
  };

  try {
    const response = await axios({ method, url, headers });
    return response.data;
  } catch (error) {
    console.error("Error making request to Binance", error);
    throw error;
  }
}

module.exports = { binanceRequest };
