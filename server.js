import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'
import mainRouter from './routes/index.js';  // master router

// --- __dirname shim (ESM) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(
  session({
    secret: "my_secret_key",  // session sign karne ke liye
    resave: false,            // session ko har request pe dubara save na karo
    saveUninitialized: true,  // empty session bhi save karo
    cookie: { maxAge: 60000 } // 1 minute session expiry
  })
);
// Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount all routes
app.use('/', mainRouter);



app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
