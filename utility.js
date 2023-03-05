const fs = require('fs');
const path = require('path');

class Utility {

    static IsPhoneNumberValid(text) {
        const phoneNumber = text.toLowerCase().replace(/one/g, '1')
                        .replace(/two/g, '2')
                        .replace(/three/g, '3')
                        .replace(/four/g, '4')
                        .replace(/five/g, '5')
                        .replace(/six/g, '6')
                        .replace(/seven/g, '7')
                        .replace(/eight/g, '8')
                        .replace(/nine/g, '9')
                        .replace(/\D/g, '');
        const regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;
        const isValidNumber = regex.test(num);
        return isValidNumber;
    }      

    static RemoveAllSoundBytes() {
        const directoryPath = './soundbytes';
        fs.readdir(directoryPath, (err, files) => {
          if (err) throw err;
        
          files.forEach(file => {
            if (path.extname(file) === '.mp3') {
              fs.unlink(path.join(directoryPath, file), err => {
                if (err) throw err;
                console.log(`Successfully deleted ${file}`);
              });
            }
          });
        });
    }

}

module.exports = Utility;
