// esewa.js - FINAL CORRECT VERSION
const crypto = require('crypto');
const axios = require('axios');

function getEsewaHash(total_amount, transaction_uuid, product_code) {
    // eSewa signature format (from official docs): "total_amount=X,transaction_uuid=Y,product_code=Z"
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    console.log('Signature message:', message);
    console.log('Secret key:', process.env.ESEWA_SECRET_KEY);

    // Generate HMAC-SHA256 signature
    const signature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(message)
        .digest('base64');

    console.log('Generated signature:', signature);

    return {
        signature,
        signed_field_names: 'total_amount,transaction_uuid,product_code'
    };
}

async function verifyEsewa(encodedData) {
    const decoded = Buffer.from(encodedData, 'base64').toString();
    const json = JSON.parse(decoded);

    // Verify with eSewa status endpoint
    const statusUrl = `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/`;
    const res = await axios.get(statusUrl, {
        params: {
            product_code: process.env.ESEWA_PRODUCT_CODE,
            total_amount: json.total_amount,
            transaction_uuid: json.transaction_uuid
        }
    });
    return res.data;
}

module.exports = { getEsewaHash, verifyEsewa };