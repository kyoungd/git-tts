const textToSpeech = require('@google-cloud/text-to-speech');
require('dotenv').config();

// console.log('env: ' + process.env.GOOGLE_APPLICATION_CREDENTIALS)

async function Speech4Web(text) {
  const client = new textToSpeech.TextToSpeechClient();
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
  return (response.audioContent);
}

module.exports = Speech4Web;
