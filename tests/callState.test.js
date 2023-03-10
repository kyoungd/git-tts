const request = require('supertest');
const CallState = require('../callState.js');
const { GetNextMessage } = require('../nextMessage.js');
const SMS = require('../sms.js');
const app = require('../index'); 

describe('phone call state', () => {
    jest.setTimeout(30000);
    let phoneCallState;
    let callObject;

    it('initalize OK', () => {
        phoneCallState = new CallState();
        const message = phoneCallState.LastMessage;
        expect(message).toBe('');
    });

    it('first message demo success', async() => {
        const inObject = { 'template': 'demo_e46ee1013e65' };
        const result = await request(app).post('/state').send(inObject);
        expect(result.status).toBe(200);
        const callObject = result.body.data;
        const { IsPhoneCallEnd, LastMessage } = callObject.getters;
        expect(IsPhoneCallEnd).toBe(false);
        expect(LastMessage).toContain('Amy');
    });

    it('first message OK', async() => {
        const result = await request(app).post('/state');
        expect(result.status).toBe(200);
        callObject = result.body.data;
        const { IsPhoneCallEnd, LastMessage } = callObject.getters;
        expect(IsPhoneCallEnd).toBe(false);
        expect(LastMessage).toContain('Hi.  I am');
    });

    it('second message OK', async() => {
        userInput = 'I got into an accident three days ago.  Can you help?';
        callObject.input.userInput = userInput;
        const result = await request(app).post('/state').send(callObject);
        expect(result.status).toBe(200);
        callObject = result.body.data;
        const { IsPhoneCallEnd, LastMessage } = callObject.getters;
        expect(IsPhoneCallEnd).toBe(false);
        expect(LastMessage).toContain('tell me about');
    });

    // it('set state check', () => { 
    //     phoneCallState.State = firstResponse;
    //     const firstMessage = phoneCallState.LastMessage;
    //     expect(firstMessage.length).toBeGreaterThan(0);
    // });

    // it('first message from api', async () => {
    //     const blank = {};
    //     const result = await GetNextMessage(blank, '');
    //     expect(result.status).toBe(200);
    //     phoneCallState.State = result.data;
    //     const firstMessage = phoneCallState.LastMessage;
    //     expect(firstMessage.length).toBeGreaterThan(0);
    // });

    // // it('next message from api', async () => {
    // //     phoneCallState.State = firstResponse;
    // //     expect(phoneCallState.Reply).toBe('Got it.');
    // //     expect(phoneCallState.Status).not.toBe('');
    // //     const firstMessage = phoneCallState.LastMessage;
    // //     expect(firstMessage.length).toBeGreaterThan(0);
    // //     const result1 = await GetNextMessage(phoneCallState.State, 'I got into an accident three days ago.  Can you help?');
    // //     expect(result1.status).toBe(200);
    // //     phoneCallState.State = result1.data;
    // //     expect(phoneCallState.State.id).toBe(200);
    // //     expect(phoneCallState.Reply).toBe('Hold on.  I am writing it down.');
    // //     const secondMessage = phoneCallState.LastMessage;
    // //     expect(secondMessage.length).toBeGreaterThan(0);
    // //     //
    // //     r2 = "It was three day ago, at 7:00 PM and John, my brother, was driving home from work. He had been looking forward to getting home to see his family and relax after a long day. He was driving on a busy highway, and traffic was heavy. Suddenly, out of nowhere, a car came speeding into his lane and hit him head-on. John's car spun out of control, and he felt a sharp pain in his chest as his seatbelt tightened. The airbags deployed, and he heard the sound of metal crunching. His car finally came to a stop on the side of the road, and he was trapped inside. He was dazed and confused and could feel the blood running down his face from a cut on his forehead. The other driver was also injured, and he stumbled out of his car. The police arrived shortly after, and the paramedics were called to the scene. John was carefully extracted from his car, and he was rushed to the hospital with serious injuries. He is at the hospital recovering in the hospital with broken ribs, a collapsed lung and head injury with couple of stitches."
    // //     const result2 = await GetNextMessage(phoneCallState.State, r2);
    // //     expect(result2).not.toBe(null);
    // //     expect(result2.status).toBe(200);
    // //     phoneCallState.State = result2.data;
    // // });

    // it('test printing out transcript', async () => {
    //     phoneCallState.State = secondResponse;
    //     const trans = phoneCallState.Transcript;
    //     expect(trans).not.toBe(null);
    //     phoneCallState.Called = "+13236414381";
    //     phoneCallState.Caller = "+18186793565";
    //     phoneCallState.CallSid = "0";
    //     phoneCallState.FromCity = "Burbank";
    //     phoneCallState.FromState = "CA";
    //     const smsText = new SMS();
    //     await smsText.SendSMSFromState(phoneCallState);
    // });

});
