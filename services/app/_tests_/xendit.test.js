const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const token_user =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxLCJlbWFpbCI6ImFuZHJpemFsLmNzQGdtYWlsLmNvbSIsImlhdCI6MTY1MDIyMDk2NX0.3aNbVzTNVCDI1Oubicm6eqbbFuXLV6Aa83cps_g4t4w"
const dataXendit = {
    "id": "579c8d61f23fa4ca35e52da4",
    "external_id": "1_1",
    "user_id": "5781d19b2e2385880609791c",
    "is_high": true,
    "payment_method": "BANK_TRANSFER",
    "status": "PAID",
    "merchant_name": "Xendit",
    "amount": 50000,
    "paid_amount": 50000,
    "bank_code": "PERMATA",
    "paid_at": "2016-10-12T08:15:03.404Z",
    "payer_email": "wildan@xendit.co",
    "description": "This is a description",
    "adjusted_received_amount": 47500,
    "fees_paid_amount": 0,
    "updated": "2016-10-10T08:15:03.404Z",
    "created": "2016-10-10T08:15:03.404Z",
    "currency": "IDR",
    "payment_channel": "PERMATA",
    "payment_destination": "888888888888"
}

const wrongdataXendit1 = {
    "id": "579c8d61f23fa4ca35e52da4",
    "external_id": "10_1",
    "user_id": "5781d19b2e2385880609791c",
    "is_high": true,
    "payment_method": "BANK_TRANSFER",
    "status": "PAID",
    "merchant_name": "Xendit",
    "amount": 50000,
    "paid_amount": 50000,
    "bank_code": "PERMATA",
    "paid_at": "2016-10-12T08:15:03.404Z",
    "payer_email": "wildan@xendit.co",
    "description": "This is a description",
    "adjusted_received_amount": 47500,
    "fees_paid_amount": 0,
    "updated": "2016-10-10T08:15:03.404Z",
    "created": "2016-10-10T08:15:03.404Z",
    "currency": "IDR",
    "payment_channel": "PERMATA",
    "payment_destination": "888888888888"
}

const wrongdataXendit2 = {
    "id": "579c8d61f23fa4ca35e52da4",
    "external_id": "1_10",
    "user_id": "5781d19b2e2385880609791c",
    "is_high": true,
    "payment_method": "BANK_TRANSFER",
    "status": "PAID",
    "merchant_name": "Xendit",
    "amount": 50000,
    "paid_amount": 50000,
    "bank_code": "PERMATA",
    "paid_at": "2016-10-12T08:15:03.404Z",
    "payer_email": "wildan@xendit.co",
    "description": "This is a description",
    "adjusted_received_amount": 47500,
    "fees_paid_amount": 0,
    "updated": "2016-10-10T08:15:03.404Z",
    "created": "2016-10-10T08:15:03.404Z",
    "currency": "IDR",
    "payment_channel": "PERMATA",
    "payment_destination": "888888888888"
}

describe(`GET /customers/trancsaction/trancsactionId success`, () => {
    describe(`GET /customers/trancsaction/4 success`, () => {
        it(`should return an object with status 200`, async () => {
            const res = await request(app)
                .get("/customers/transactions/4")
                .set('access_token', token_user);
            expect(res.status).toBe(200);
        });

        it(`should return an object with status 200 success`, async () => {
            const res = await request(app)
                .get("/customers/transactions/1")
                .set('access_token', token_user);

            expect(res.status).toBe(200);
        });
    });

    describe(`GET /customers/trancsaction/1 fail`, () => {
        it(`should return an object with status 401 fail`, async () => {
            const res = await request(app)
                .get("/customers/transactions/1")
                .set('access_token', '12345');

            expect(res.status).toBe(401);
        });
        it(`should return an object with status 404 fail`, async () => {
            const res = await request(app)
                .get("/customers/transactions/100")
                .set('access_token', token_user);

            expect(res.status).toBe(404);
        });
    });
})

describe(`POST /xendit`, () => {
    describe(`POST /xendit sukses`, () => {
        it(`should return an object with status 200`, async () => {
            const res = await request(app)
                .post("/xendit")
                .send(dataXendit);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("msg");
            expect(res.body).toHaveProperty("msg", expect.any(String));
        });
    });

    describe(`POST /xendit fail`, () => {
        it(`should return an object with status 404`, async () => {
            const res = await request(app)
                .post("/xendit")
                .send(wrongdataXendit1);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("Error");
            expect(res.body).toHaveProperty("Error", expect.any(String));
        });

        it(`should return an object with status 500`, async () => {
            const res = await request(app)
                .post("/xendit")
                .send(wrongdataXendit2);
            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty("Error");
            expect(res.body).toHaveProperty("Error", expect.any(String));
        });
    });
})