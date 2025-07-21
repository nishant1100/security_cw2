//index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3001;

function signMessage(message) {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY)
        .update(message).digest('base64');
}

app.post('/api/esewa/initiate', (req, res) => {
    const { amount, transaction_uuid } = req.body;
    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;
    const signature = signMessage(message);

    res.json({
        amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid,
        product_code: process.env.ESEWA_MERCHANT_CODE,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: process.env.ESEWA_CALLBACK_SUCCESS,
        failure_url: process.env.ESEWA_CALLBACK_FAILURE,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature,
        api_endpoint: process.env.ESEWA_BASE_URL + '/api/epay/main/v2/form'
    });
});

app.post('/api/esewa/verify', async (req, res) => {
    const { total_amount, transaction_uuid, product_code } = req.body;
    try {
        const response = await axios.get(process.env.ESEWA_BASE_URL + '/api/epay/transaction/status/', {
            params: { total_amount, transaction_uuid, product_code }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
