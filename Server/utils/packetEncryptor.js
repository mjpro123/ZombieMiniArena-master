function getPacketEncryption(packet) {
        try {

    function numberToLetter(number) {
        return String.fromCharCode(number  + 64);
    }
    
    function letterToNumber(letter) {
        return letter.charCodeAt(0) - 64;
    }

    function transformCharacter(character, amount) {
        const numberValue = letterToNumber(character);
        const modifiedNumber = numberValue - amount;
        const transformedCharacter = numberToLetter(modifiedNumber);
        return transformedCharacter;
    }

    function getDecode(encoded) {
        try {
        var xor = [];
        var starter = letterToNumber(encoded[0]);
        var stringifed = encoded.slice(1);

        if (!stringifed[0]) {
            starter = letterToNumber(encoded[0][0])
            stringifed = encoded[0].slice(1);
        };

        let mini = "";

        for (let i = 0; i < stringifed.length; i++) {
            mini += transformCharacter(stringifed[i], starter)
        }

        var sections = mini.split(',');

        for (let i = 0; i < sections.length; i++) {
            xor.push(isNaN(sections[i]) ? sections[i] : Number(sections[i]))
        }
    
        return xor;
        } catch(e) { return true };
    };

    var decodedPacket = getDecode(packet);

    return decodedPacket;

    } catch(e) { console.log('Packet Decryption Error'); }
}
module.exports = { getPacketEncryption };