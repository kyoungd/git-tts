const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
require('dotenv').config();

async function GoogleGenerateSpeech(text) {

    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    // The text to synthesize

    // Construct the request
    // const request = {
    //   input: { text },
    //   // Select the language and voice
    //   voice: { languageCode: 'en-US', name: 'en-US-Neural2-C' },
    //   // Select the type of audio encoding
    //   audioConfig: { audioEncoding: 'MP3' },
    // };
    const request = {
        "audioConfig": {
            "audioEncoding": "LINEAR16",
            "effectsProfileId": [
                "small-bluetooth-speaker-class-device"
            ],
            "pitch": 4.4,
            "speakingRate": 1,
            "audioEncoding": "MP3",

        },
        "input": { text },
        "voice": {
            "languageCode": "en-US",
            "name": "en-US-Neural2-C"
        }
    };

    // Send the request to the text-to-speech API
    const [response] = await client.synthesizeSpeech(request);

    // Write the audio content to a file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output2.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}

const text = 'They identified themselves as "the Trump tribe from Texas", a quintet that supports the former US president "1,000%" in his third White House run. Other Republicans should step aside, said group leader Michael Manuel Reaud. "Let the only man that knows how to run this country run the country. We do not want to divide the vote.';

GoogleGenerateSpeech(text).then(() => {
    console.log('done');
});

