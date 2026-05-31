import express from 'express';
import 'dotenv/config';
import './bot.js';

import { prisma } from './prisma.js';

///////////////////////////////
const tryCatch = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

console.log('Starting...');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
///////////////////////////////


const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json());

router.get('/', (req,res) => {
  res.status(200).json({message: 'OK (but why are you here? go to the endpoints)'})
})

// .../commandsQueued?jobId=x and x is jobId in the function

router.get('/commandsQueued', tryCatch(async (req, res) => { 
  const { jobId } = req.query;

  const pending = await prisma.command.findMany({
    where: {
      status: 'pending',
      ...(jobId && { jobId })
    }
  });

  const parsedCommands = pending.map(cmd => ({
    ...cmd,
    parameters: JSON.parse(cmd.parameters)
  }));

  res.json(parsedCommands);
}));

router.get('/health', (req,res) => {
   res.status(200).json({ message: 'OK' });
})

router.post('/requestFinished', tryCatch(async (req, res) => {
  const id = req.body.id;
  if (id == null) {return res.status(400).json({message: "Invalid Request"})}

  const cmd = await prisma.command.findUnique({where: { id: id }});
  if (cmd == null) {return res.status(404).json({message: "404 Not Found"})}

  await prisma.command.delete({
    where: { id: id }
  })

  res.status(200).json({message: "Command deleted"})
  // later on, add a queue system thingy for './commandQueue.json'
}));

app.use('/', router);

app.listen(port,()=>{
  console.log("Running")
});