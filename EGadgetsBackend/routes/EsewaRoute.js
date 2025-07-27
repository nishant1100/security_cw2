// esewaRoute.js - FINAL CORRECT VERSION
const express = require('express');
const { getEsewaHash, verifyEsewa } = require('../security/Esewa');
const router = express.Router();

// Initiate Payment Route
router.post('/initiate', (req, res) => {
  const { total_amount, txnUUID } = req.body;
  console.log("✅ eSewa /initiate req.body:", req.body);

  if (!total_amount || !txnUUID) {
    return res.status(400).json({ error: 'Missing total_amount or txnUUID' });
  }

  // Generate signature using the correct eSewa format
  const { signature, signed_field_names } = getEsewaHash(
    total_amount.toString(),
    txnUUID,
    process.env.ESEWA_PRODUCT_CODE
  );

  const responsePayload = {
    gateway: `${process.env.ESEWA_GATEWAY_URL}/api/epay/main/v2/form`,
    params: {
      amount: total_amount.toString(),  // eSewa requires separate 'amount' field
      tax_amount: "0",  // Required field, set to 0 if no tax
      product_service_charge: "0",  // Required field, set to 0 if no service charge
      product_delivery_charge: "0",  // Required field, set to 0 if no delivery charge
      total_amount: total_amount.toString(),  // Required for signature validation
      transaction_uuid: txnUUID,
      product_code: process.env.ESEWA_PRODUCT_CODE,
      success_url: process.env.ESEWA_SUCCESS_URL,
      failure_url: process.env.ESEWA_FAILURE_URL,
      signed_field_names: signed_field_names,
      signature: signature
    }
  };

  console.log("📤 Final response payload:", responsePayload);
  return res.json(responsePayload);
});

// Callback Route for Verification
router.post('/callback', async (req, res) => {
  try {
    const status = await verifyEsewa(req.body.encodedData);
    res.json({ verified: true, status });
  } catch (err) {
    console.error("❌ Error verifying eSewa:", err);
    res.status(400).json({ verified: false, error: err.message });
  }
});

module.exports = router;