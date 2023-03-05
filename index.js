const axios = require('axios');
const cors = require('cors');
const express = require("express");
const fs = require('fs');

const morgan = require('morgan');
const winston = require('./winston/config');
require('dotenv').config()

const { GenerateSpeech, SpeechFileName } = require('./text2speech.js');
const { GetNextMessage, MessageLog } = require('./nextMessage.js');
const SMS = require('./sms.js');
const CallState = require('./callState.js');

const Speech4Web = require('./speech4web.js');
const CreateSpeech = require('./speech_file.js');

const app = express();
app.use(morgan('combined', { stream: winston.stream }));
const urlencoded = require('body-parser').urlencoded;
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
const server = require("http").createServer(app);

winston.info('Start winston and morgan logging');

app.post("/tts", async (req, res) => {
  const text = req.body.text;
  const raw = await GenerateSpeech(text);
  const block = { result: 'OK', data: raw, message: 'success', filename: SpeechFileName(text) };
  res.json(block);
});

app.post('/sms', async(req, res) => {
  const text = req.body.text;
  const fromPhone = process.env.FROM_PHONE;
  const toPhone = req.body.to;
  const smsText = new SMS();
  const result = await smsText.SendSMS(fromPhone, toPhone, text);
  const block = { result: 'OK', data: result, message: 'success' };
  res.json(block);
});

//
// This is the main entry point for the call.
// properites: { call, reply, template }
// call is the call object which includes state, but has extra information.
// reply is he user reply
// template is the analysis template file
//
app.post('/state', async(req, res) => {
  try {
    winston.log('info', 'post /state', {req: req.body});
    await MessageLog('gpt-tts', 'post /state', 'called', req.body);
    const message = req.body && req.body.reply ? req.body.reply : '';
    const templateFile = req.body && req.body.template ? req.body.template : null;
    const call = req.body && req.body.call ? req.body.call : {};
    const callState = new CallState(call);
    callState._input.userInput = message;
    const result1 = await GetNextMessage(callState.GetState(), message, templateFile);
    if (result1.status === 200) {
      callState.State = result1.data;
      const thisCall = callState.ReturnObject();
      const block = { result: 'OK', data: thisCall, message: 'success' };
      res.json(block);
    }
    else {
      await MessageLog('gpt-tts', 'post /state', 'ERROR, status id not 200', result1);
      console.log(result);
      throw new Error('Failed to get next message.');  
    }
  }
  catch (error) {
    MessageLog('gpt-tts', 'post /state', error.stack, error)
    console.log(error);
    const block = { result: 'ERROR', data: null, message: error.message };
    res.json(block);
  }
});

app.get('/ping', (req, res) => {
  res.json({'message': 'pong'});
});

app.get('/token', async (req, res) => {
  try {
    const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
      { expires_in: 3600 }, // can set a TTL timer in seconds.
      { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }); // AssemblyAI API Key goes here
    const { data } = response;
    console.log('returned token');
    res.json(data);
  } catch (error) {
    console.log('error getting token - ', error);
    const {response: {status, data}} = error;
    res.status(status).json(data);
  }
});

app.post('/speech4web', async (req, res) => {
  try {
    const text = req.body.text;
    const filename = await CreateSpeech(text, Speech4Web);
    const audioFile = fs.createReadStream(filename);
    audioFile.pipe(res);
  }
  catch (error) {
    console.log('error getting token - ', error);
    res.status(500);
  }
});

app.get('/speech4web', async (req, res) => {
  try {
    const text = req.query.text;
    const filename = await CreateSpeech(text, Speech4Web);
    const audioFile = fs.createReadStream(filename);
    audioFile.pipe(res);
  }
  catch (error) {
    console.log('error getting token - ', error);
    res.status(500);
  }
});

// Start server
// console.log(`Listening at Port ${process.env.PORT | "default PORT=3001. Set PORT environ."}`);
server.listen(process.env.PORT || 3001);

module.exports = app;
