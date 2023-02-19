const axios = require('axios');
require('dotenv').config()

async function GetNextMessage (data, message, template=null) {
    try {        
        const url = process.env.REACT_APP_GPT3_URL || 'http://localhost:5000/callcenter';
        const block = { data, message, template };
        const result = await axios.post(url, block, {
            headers: {
              'Content-Type': 'application/json'
            }
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function GetNextMessageSafe(phoneState, userInput) {
    try {
      const result = await GetNextMessage(phoneState.State, userInput);
      if (result.status === 200) {
        phoneState.State = result.data;
        const message = phoneState.LastMessage;
        const reply = phoneState.Reply;
        return {success: true, message, reply};
      }
      console.log(result && result.status_coode ? result.status_code : 'UNKNOWN ERROR');
      return {success: false, message:'', reply:''};
    }
    catch (err) {
      console.log(err);
      return {success:false, message:'', reply:''};
    }
  }
  
module.exports = { GetNextMessage, GetNextMessageSafe };
