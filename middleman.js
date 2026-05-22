import express from 'express';
import 'dotenv/config';
import './bot.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json());

router.get('/', (req,res) => {
  res.status(200).json({message: 'OK (but why are you here? go to the endpoints)'})
})

router.get('/commandsQueued', async (req, res) => {
  // get to it.
  const pending = await prisma.command.findMany({
    where: { status: 'pending' }
  });

  const parsedCommands = pending.map(cmd => ({
    ...cmd,
    parameters: JSON.parse(cmd.parameters)
  }))

  res.json(parsedCommands);
});

router.get('/health', (req,res) => {
   res.status(200).json({ message: 'OK' });
})

router.post('/requestFinished', async (req, res) => {
  const id = req.body.id;
  if (id == null) {return res.status(400).json({message: "Invalid Request"})}

  const cmd = await prisma.command.findUnique({where: { id: id }});
  if (cmd == null) {return res.status(404).json({message: "404 Not Found"})}

  await prisma.command.delete({
    where: { id: id }
  })
  res.status(200).json({message: "Command deleted"})
  // later on, add a queue system thingy for './commandQueue.json'
});

app.use('/', router);
app.listen(port);