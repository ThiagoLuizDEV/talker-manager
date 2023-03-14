const fs = require('fs').promises;

const { join } = require('path');

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

module.exports = {
    allTalkers,
};