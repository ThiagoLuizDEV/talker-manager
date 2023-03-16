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
    const validation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

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

const validationToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Token não encontrado' });
    }
    if (authorization.length !== 16) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    next();
};

const validationName = (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'O campo "name" é obrigatório' });
    }
    if (name.length < 3) {
        return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    }
    next();
};

const validationAge = (req, res, next) => {
    const { age } = req.body;
    if (!age) {
        return res.status(400).json({ message: 'O campo "age" é obrigatório' });
    }
    if (age < 18 || !Number.isInteger(age)) {
        return res.status(400).json(
            { message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' },
);
    }
    next();
};

const validationTalk = (req, res, next) => {
    const { talk } = req.body;

    if (!talk) {
        return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
    }

    next();
};

const validationWatched = (req, res, next) => {
    const { watchedAt } = req.body.talk;

    const regexDate = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(20[0-9]{2}|[3-9][0-9])$/i;

    if (!watchedAt) {
        return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
    }

    if (!regexDate.test(watchedAt)) {
        return res.status(400)
        .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
    next();
};

const validationNumber = (num) => !Number.isInteger(num) || (num < 1 || num > 5);

const validationRate = (req, res, next) => {
    const { rate } = req.body.talk;

    if (!rate && rate !== 0) {
        return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
    }
    if (validationNumber(rate)) {
        return res.status(400)
        .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
    }
    next();
};
const writeTalke = async (content) => {
    try {
    await fs.writeFile(completePath, JSON.stringify(content, null, 2, 'utf-8'));
    } catch (e) {
        console.error(e.message);
    }
}; 

const UpTalkerID = async (id, name, age, talk) => {
    const data = await readTalker();
    const talkerIndex = data.findIndex((talker) => talker.id === +id);
    if (talkerIndex === -1) {
      return false;
    }
    const updatedTalker = {
        ...data[talkerIndex],
        name,
        age,
        talk,
      };
    data[talkerIndex] = updatedTalker;
    await writeTalke(data);
    return updatedTalker;
  };

const deleteTalker = async (id) => {
    const data = await readTalker();
    const deleteTalkerFilter = data.filter((talk) => talk.id !== id);
    await writeTalke(JSON.stringify(deleteTalkerFilter));
};

const talkerSearch = async (q) => {
    const data = await readTalker();

    const searchTalkerFilter = data.filter((talk) => talk.name.includes(q));

    return searchTalkerFilter;
};

module.exports = {
    allTalkers,
    talkerID,
    randomTalker,
    validationEmail,
    validationPassword,
    validationToken,
    validationName,
    validationAge,
    validationTalk,
    validationWatched,
    validationRate,
    completePath,
    fs,
    UpTalkerID,
    deleteTalker,
    talkerSearch,
    readTalker,
};