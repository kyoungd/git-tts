const _ = require('lodash');

class CallState {

    constructor(data) {
        this._state = data && data.state ? data.state : {};
        this._phone = data && data.phone ? data.phone : {
            called : '',
            caller : '',
            callSid : '',
            fromCity : '',
            fromState : ''
        };
        this._input = data && data.input ? data.input : {
            transcriptIndex : 0,
            userInput : '',
            confidence : 0,
        }
    }

    GetUserInput() {
        return this._input.userInput;
    }

    GetState() {
        return this._state;
    }

    set State(state) {
        this._state = JSON.parse(JSON.stringify(state));
    }

    set Phone(phone) {
        this._phone = JSON.parse(JSON.stringify(phone));
    }

    set Input(input) {
        this._input = JSON.parse(JSON.stringify(input));
    }

    get LastMessage() {
        if (!this._state.transcript || this._state.transcript.length === 0)
            return '';
        const arr = this._state.transcript.slice(this._input._transcriptIndex);
        this._input._transcriptIndex = this._state.transcript.length;
        const aiMessages = arr.filter(obj => obj.name === 'AI');
        const message = _.map(aiMessages, 'text').join(' ');
        return message;
    }

    get Reply() {
        try {
            const id = this._state.id;
            const gpt3s = this._state.gpt3;
            const gpt3 = gpt3s.find(obj => obj.id === id);
            const reply = gpt3.reply;
            return reply;
        }
        catch (err) {
            return 'Okay.';
        }
    }

    get SpeechTimeout() {
        try {
            const id = this._state.id;
            const gpt3s = this._state.gpt3;
            const gpt3 = gpt3s.find(obj => obj.id === id);
            const timeout = gpt3.speechtimeout;
            return timeout === 0 ? 1.5 : timeout.toString();
        }
        catch (err) {
            return 'Okay.';
        }
    }

    get Status() {
        const gpt3s = this._state.gpt3;
        const filtered = gpt3s.filter(obj => ('q' in obj));
        const result = filtered.reduce((total, curr) => {
            const regex = /\"q\"\s*:\s*\"(.*?)\"/;
            const question = curr.q.match(regex)[1];
            const answer = curr.a;
            total = `${total}\n ${question} - ${answer}`;
            return total;
        }, '');
        return result;
    }

    get IsPhoneCallEnd() {
        try {
            const id = this._state.id;
            const gpt3s = this._state.gpt3;
            const gpt3 = gpt3s.find(obj => obj.id === id);
            return (obj.type === 'goodbye');
        }
        catch (err) {
            return false;
        }
    }

    callDetail() {
        let data = '';
        data += this._phone._called ? `Called: ${this.phone._called}\n` : '';
        data += this._phone._caller ? `Caller: ${this.phone._caller}\n` : '';
        data += this._phone._callSid ? `CallSid: ${this.phone._callSid}\n` : '';
        data += this._phone._fromCity ? `FromCity: ${this.phone._fromCity}\n` : '';
        data += this._phone._fromState ? `FromState: ${this.phone._fromState}\n` : '';
        return data;
    }

    get Transcript() {
        try {
            const data = this.callDetail();
            const arrLength = this._state.transcript.length;
            const trans = this._state.transcript.reduce((sum, curr, index) => {
                const extra = (index < arrLength - 1 ? '\n' : '');
                return sum + `${curr.name}: ${curr.text} ${extra}`;
            }, data);
            return trans;
        }
        catch (err) {
            console.log(err);
            return 'transcript not found.';
        }
    }

    ReturnObject() {
        const getters = this.gettersObject();  // must excute first for LastMessage to be updated
        return {
            state: this._state,
            phone: this._phone,
            input: this._input,
            getters
        }
    }

    gettersObject() {
        const result = {
            LastMessage: this.LastMessage,
            Reply: this.Reply,
            SpeechTimeout: this.SpeechTimeout,
            Status: this.Status,
            IsPhoneCallEnd: this.IsPhoneCallEnd,
            Transcript: this.Transcript
        }
        return result;
    }

}

module.exports = CallState;
