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

const validationEmail = (req, res, next) => {
    const { email } = req.body;
    const validation = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

    if (!email) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }

    if (!validation.test(email)) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    next();
};

const validationPassword = (req, res, next) => {
    const { password } = req.body;
    const passwordLength = 6;

    if (!password) {
        return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    }

    if (password.length < passwordLength) {
        return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    next();
};

module.exports = {
    allTalkers,
    talkerID,
    randomTalker,
    validationEmail,
    validationPassword,
};