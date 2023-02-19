// sample test file using supertest and jest
const request = require('supertest');
const { getExpectedBodyHash } = require('twilio/lib/webhooks/webhooks');
const app = require('../index');

describe('POST /tts', () => {

    it("is server alive", () => {
        return request(app)
            .get('/ping')
            .expect(200);
    });

    it('google text to audio', async() => {
        const res = await request(app)
        .post('/tts')
        .send({
            text: 'hello world'
        });
        expect(res.status).toBe(200);
        expect(res.body.result).toBe('OK');
        expect(res.body.data).not.toBe(null);
    });

    it('test SMS text', async() => {
        const res = await request(app)
        .post('/sms')
        .send({
            text: 'hello world',
            to: '+18186793565'
        });
        expect(res.status).toBe(200);
        expect(res.body.result).toBe('OK');
        expect(res.body.data).not.toBe(null);
    })

});
