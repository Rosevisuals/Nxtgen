const request = require('supertest');
const express = require('express');

const app = express();

const STAFF_ID = 1;
const NOT_STAFF_ID = 2;
const mockStaff = {
    staff_id: 1,
    user_id: 1,
    specialization: "DOCTOR",
    biodata: "Height 180;Weight 85;Heart rate 72;",
    head_department: false,
    license_number: "DOCTOR-001",
    role_id: 2,
    department_id: 1,
    created_at: "2023-01-01T00:00:00Z"
};

describe('GET /api/staff', () => {
    it('returns OK status', async () => {
        const response = await request(app)
            .get('/api/staff')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        expect(response.status).toEqual(200);
        expect(response.body).toBeDefined;
        expect(Array.isArray(response.body)).toBe(true);
    })
});

describe('GET /api/staff:/id', () => {
    // it('return OK status', async () => {
    //     const response = await request(app)
    //         .get(`/api/staff/${STAFF_ID}`)
    //         .set('Accept', 'application/json')
    //         .set('Content-Type', 'application/json')
    //         .send({ ...mockStaff });
    //     expect(response.status).toEqual(200);
    //     expect(response.body).toBeDefined;
    //     expect(response.body.staff_id).toEqual(STAFF_ID);
    // });

    //     it('return NOT FOUND status', async () => {
    //         const response = await request(app)
    //             .get(`/api/staff/${NOT_STAFF_ID}`)
    //             .set('Accept', 'application/json')
    //             .expect('Content-Type', /html/)
    //             .expect(404);
    //     });
});