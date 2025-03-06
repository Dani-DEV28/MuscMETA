// app.js
import express from "express";
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port: process.env.DB_PORT
});

async function connect() {
  try {
      let conn = await pool.getConnection();
      console.log("connected to database");
      return conn;
  } catch (err) {
      console.log(`Error connecting to the database: ${err}`);
  }
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve static files from the 'public' directory
app.use(express.static("public"));

// set the view engine for out application

app.set('view engine', 'ejs');
const PORT = process.env.APP_PORT || 3000;

app.get("/", (req, res) => {
  // Send our home page as a response to the client
  res.render("home");
});

app.post('/', (req, res) => {

    // Send our home page as a response to the client
    res.render('home');
});

app.post('/search', async (req, res) => {
    console.log(req.body.userInput);
    res.render('searchResult');
});

app.post('/list', async (req, res) => {
    res.render('trackList');
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
