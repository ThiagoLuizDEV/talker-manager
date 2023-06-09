const express = require('express');
const fsFunctions = require('./fsFunctions');

const { validationEmail,
  validationPassword,
  validationToken,
  validationName,
  validationAge,
  validationTalk,
  validationWatched,
  validationRate,
  deleteTalker,
 } = fsFunctions;

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', validationToken, async (req, res) => {
  const { q } = req.query;
  const search = await fsFunctions.talkerSearch(q);
  return res.status(200).json(search);
});

app.get('/talker', async (_req, res) => {
  const result = await fsFunctions.allTalkers();
  return res.status(200).json(result);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await fsFunctions.talkerID(id);

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validationPassword, validationEmail, (_req, res) => {
  const result = fsFunctions.randomTalker();
  return res.status(200).json({ token: result });
});

app.post('/talker',
validationToken,
validationName,
validationAge,
validationTalk,
validationWatched,
validationRate,
async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const result = await fsFunctions.allTalkers();

  const futureTalk = {
    name,
    age,
    id: result.length += 1,
    talk: {
      watchedAt,
      rate,
    },
  };
  const talkers = JSON.stringify([futureTalk]);
  await fsFunctions.fs.writeFile(fsFunctions.completePath, talkers);
  return res.status(201).json(futureTalk);
});
app.put('/talker/:id',
validationToken,
validationName,
validationAge,
validationTalk,
validationWatched,
validationRate,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  
  const up = await fsFunctions.UpTalkerID(+id, name, age, talk);
  if (!up) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 

    return res.status(200).json(up);
});

app.delete('/talker/:id', validationToken, async (req, res) => {
  const { id } = req.params;
  await deleteTalker(+id);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
