const fs = require('fs').promises;

const { join } = require('path');

const crypto = require('crypto');

const path = ('./talker.json');

const completePath = join(__dirname, path);

const readTalker = async () => {
    try {
        const talkers = await fs.readFile(completePath, 'utf-8');
        return JSON.parse(talkers);
    } catch (error) {
            console.log(error.message);
            return null;
    }
};

const allTalkers = async () => {
    const data = await readTalker();
    return data;
};

const talkerID = async (id) => {
    const data = await readTalker();
    
    const talkerId = data.find((talker) => talker.id === +id);
    return talkerId;
};

const randomTalker = () => {
    const random = crypto.randomBytes(8).toString('hex');
    return random;
};

module.exports = {
    allTalkers,
    talkerID,
    randomTalker,
};