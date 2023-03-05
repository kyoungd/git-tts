const fs = require('fs');
const util = require('util');

function SpeechFileName(text) {
    const text1 = text
      .replace(new RegExp(" ", "g"), "-")
      .replace(new RegExp("\"", "g"), "")
      .replace(new RegExp("/", "g"), "-")
      .replace(new RegExp("'", "g"), "")
      .replace(new RegExp(",", "g"), "")
      .replace(new RegExp("\\.", "g"), "");
    const fnExtract = text1.length < 248 ? text1 : text1.substring(0, 248);
    const fn = fnExtract.toLowerCase();
    const outputFile = `./soundbytes/${fn}.mp3`;
    return outputFile;
  }
  
  async function SaveSpeechFile(text, data) {
    try {
      const outputFile = SpeechFileName(text);
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(outputFile, data, 'binary');
      return outputFile;  
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }
  
  function IsSpeechFileExist(text) {
    const outputFile = SpeechFileName(text);
    return fs.existsSync(outputFile);
  }
  
  async function CreateSpeech(text, func) {
    try {
      if (IsSpeechFileExist(text)) {
        return SpeechFileName(text);
      }
      const data = await func(text);
      const filename = SaveSpeechFile(text, data);
      return filename;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }
  
  module.exports = CreateSpeech;
