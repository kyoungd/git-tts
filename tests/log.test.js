// sample test file using supertest and jest
const { MessageLog } = require('../nextMessage');

describe('POST /api/log', () => {

    it('message log', async() => {
        const result = await MessageLog('gpt-tts', 'log.test.js', 'test message', {test: 'test json'});
        expect(result.status).toBe(200);
    });

});
