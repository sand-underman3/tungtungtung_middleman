import express from 'express';
import 'dotenv/config';
import './bot.js';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json());

router.get('/commandsQueued', (req, res) => {
  res.json({ message: 'Unfinished right now' });
});

router.post('/requestFinished', (req, res) => {
  const body = req.body;
  res.json({ message: 'POST request', data: body });
});

app.use('/', router);
app.listen(port);