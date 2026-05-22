import express from 'express';
import 'dotenv/config';
import './bot.js';
import fs from 'fs';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json());

router.get('/', (req,res) => {
  res.status(200).json({message: 'OK (but why are you here? go to the endpoints)'})
})

router.get('/commandsQueued', (req, res) => {
  res.json({ message: 'Unfinished right now' });
});

router.get('/health', (req,res) => {
   res.status(200).json({ message: 'OK' });
})

router.post('/requestFinished', (req, res) => {
  const body = req.body;
  res.json({ message: 'POST request', data: body });
  // later on, add a queue system thingy for './commandQueue.json'
});

app.use('/', router);
app.listen(port);