// sample test file using supertest and jest
const request = require('supertest');
const { getExpectedBodyHash } = require('twilio/lib/webhooks/webhooks');
const app = require('../index');
const step2 = require('./data/step2.json');

describe('POST /state with data', () => {
    const url = '/state';
    let res = null;

    it("is server alive", () => {
        return request(app)
            .get('/ping')
            .expect(200);
    });

    it('test step 2', async() => {
        res = await request(app)
        .post(url)
        .send(step2);
        expect(res.status).toBe(200);
        expect(res.body.result).toBe('OK');
        expect(res.body.data).not.toBe(null);
        expect(res.body.data.state.id).toBe(200);
    });

});
