// sample test file using supertest and jest
const request = require('supertest');
const { getExpectedBodyHash } = require('twilio/lib/webhooks/webhooks');
const app = require('../index');

describe('POST /state', () => {
    const url = '/state';
    const templateJson = { 'template': 'demo_e46ee1013e65' };
    let res = null;

    it("is server alive", () => {
        return request(app)
            .get('/ping')
            .expect(200);
    });

    it('first time calling with demo file', async() => {
        res = await request(app)
        .post(url)
        .send(templateJson);
        expect(res.status).toBe(200);
        expect(res.body.result).toBe('OK');
        expect(res.body.data).not.toBe(null);
        expect(res.body.data.state.id).toBe(200);
    });

    it('second time calling with demo file', async() => {
        expect(res.body.data).not.toBe(null);
        const reply = "Hi Amy.  My name is Arthur Clark.  I am calling about your new AI service.  Can you have someone call me back?  Thanks."
        const call = res.body.data;
        res = await request(app)
        .post(url)
        .send({ call, reply});
        expect(res.status).toBe(200);
        expect(res.body.result).toBe('OK');
        expect(res.body.data).not.toBe(null);
        const id = res.body.data.state.id;
        expect(res.body.data.state.id).toBe(202);
    }, 10000);

    it('third time calling with demo file', async() => {
        expect(res.body.data).not.toBe(null);
        const reply = "It is eight one eight 6 7 9 356 five."
        const call = res.body.data;
        res = await request(app)
        .post(url)
        .send({ call, reply});
        expect(res.status).toBe(200);
        expect(res.body.result).toBe('OK');
        expect(res.body.data).not.toBe(null);
        const id = res.body.data.state.id;
        expect(res.body.data.state.id).toBe(901);
    });

});
