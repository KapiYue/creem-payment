const crypto = require("crypto");

function generateSignature(payload, secret) {
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computedSignature;
}

const payload = {
  "eventType": "checkout.completed",
  "object": {
    "id": "ch_1wOI6KWCZI9Xyok1Th4MaT",
    "object": "checkout",
    "request_id": "req_q0-ALoX-tP-V3BSq6nLui",
    "order": {
      "object": "order",
      "id": "ord_q3kMM0KDIvDiIOvLI0wmh",
      "customer": "cust_2h6DGJmKZ3W7q8WNxGmdQF",
      "product": "prod_4z1H3hVr6bQ0oaNtjlnhL5",
      "amount": 12900,
      "currency": "USD",
      "sub_total": 12900,
      "tax_amount": 0,
      "amount_due": 12900,
      "amount_paid": 0,
      "status": "paid",
      "type": "recurring",
      "transaction": "tran_78eiP0hlFm1NywUF79L1ER",
      "created_at": "2026-06-16T05:00:25.050Z",
      "updated_at": "2026-06-16T05:01:35.429Z",
      "mode": "test"
    },
    "product": {
      "id": "prod_4z1H3hVr6bQ0oaNtjlnhL5",
      "object": "product",
      "name": "Subscription Test",
      "description": "Subscription Test Pro",
      "image_url": "https://nucn5fajkcc6sgrd.public.blob.vercel-storage.com/Subscription-MBnHMhXcmrMDkkH2Hdjvv3FHwQgTWf.jpeg",
      "price": 12900,
      "currency": "USD",
      "billing_type": "recurring",
      "billing_period": "every-month",
      "status": "active",
      "tax_mode": "exclusive",
      "tax_category": "saas",
      "default_success_url": "https://localhost:3000/payment/success",
      "created_at": "2026-02-11T11:34:16.214Z",
      "updated_at": "2026-06-16T03:16:59.072Z",
      "mode": "test"
    },
    "units": 1,
    "success_url": "http://localhost:3000/payment/success",
    "customer": {
      "id": "cust_2h6DGJmKZ3W7q8WNxGmdQF",
      "object": "customer",
      "email": "ellnazhang520@gmail.com",
      "name": "Indie_dev",
      "metadata": null,
      "country": "US",
      "created_at": "2026-02-11T11:41:51.863Z",
      "updated_at": "2026-06-16T05:01:35.215Z",
      "mode": "test"
    },
    "subscription": {
      "id": "sub_43fYmOsLICdi3ZXAeUjEer",
      "object": "subscription",
      "product": "prod_4z1H3hVr6bQ0oaNtjlnhL5",
      "customer": "cust_2h6DGJmKZ3W7q8WNxGmdQF",
      "collection_method": "charge_automatically",
      "status": "active",
      "current_period_start_date": "2026-06-16T05:01:28.000Z",
      "current_period_end_date": "2026-07-16T05:01:28.000Z",
      "canceled_at": null,
      "created_at": "2026-06-16T05:01:31.462Z",
      "updated_at": "2026-06-16T05:01:35.541Z",
      "mode": "test"
    },
    "status": "completed",
    "mode": "test"
  },
  "id": "evt_4qYARBqGWv2Vyu1Otp94u",
  "created_at": 1781586095925
}

const secret = 'whsec_2awstBblpZfNvytxZOwyrF';
const payloadString = JSON.stringify(payload, null, 2);

// console.log(payloadString);

const response = generateSignature(payloadString, secret);

console.log(response);
