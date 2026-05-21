// lol
import express from 'express';

const app = express();
const router = express.Router();

app.use(express.json());

router.get('/', (req, res) => {
  res.json({ message: 'GET request' });
});

router.post('/', (req, res) => {
  const body = req.body;
  res.json({ message: 'POST request', data: body });
});

app.use('/', router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});