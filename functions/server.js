const express = require("express");
const cors = require("cors");
const {initializeApp, cert} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {ethers} = require("ethers");
const functions = require("firebase-functions");
const serviceAccount = require(".//serviceAccountKey.json");
initializeApp({credential: cert(serviceAccount)});
const app = express();
app.use(cors());
app.use(express.json());
const nonces = {}; // storing nonce
app.get("/api/auth/nonce", (req, res) => {
  const {address} = req.query;
  const nonce = Math.random().toString(36).substring(2);
  nonces[address]=nonce;
  res.json({nonce});
});
app.post("/api/auth/verify", async (req, res) => {
  const {address, signature} = req.body;
  const nonce = nonces[address];
  if (!nonce) return res.status(400).json({error: "No nonce"});
  const recovered = ethers.verifyMessage(nonce, signature);
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    return res.status(401).json({error: "Invalid signature"});
  }
  const firebaseToken = await getAuth().createCustomToken(address);
  res.json({firebaseToken});
});
exports.api = functions.https.onRequest(app);
