import app from './App.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [FDS Akademi Server] lancé en mode modulaire sur le port ${PORT}`);
});