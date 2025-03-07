// app.js
import express from "express";
import mariadb from 'mariadb';
import 'dotenv/config'; 

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
  const userInput = req.body.userInput;
  let conn;

  try {
      conn = await connect();
      const searchInput = await conn.query(
          "SELECT * FROM album_artist WHERE ArtistName = ? OR AlbumArtist = ?",
          [userInput, userInput]
      );

      const specificID = searchInput.length;

    // Initialize an empty array for the album list
    let retrieveAlbumList = [];

    // Loop through the search results
    for (const artist of searchInput) {
        // Query to get album singles for each artist
        const albumSingles = await conn.query(
            "SELECT * FROM album_single WHERE ArtistID = ?",
            [artist.SpecificID]
        );

        // Add the album singles to the retrieveAlbumList array
        retrieveAlbumList.push({
            artist,
            albumSingles
        });
    }

      console.log("User Input:", userInput);
      console.log("Search Result:", searchInput);
      console.log("SpecificID", specificID)
      console.log("Album List:", retrieveAlbumList);

      console.log("Album List:", retrieveAlbumList[0].albumSingles[0].AlbumIMG);

      res.render('searchResult', { retrieveAlbumList});
  } catch (err) {
      console.error("Database query error:", err);
      res.status(500).send("Internal Server Error");
  } finally {
      if (conn) conn.release(); // Ensure the connection is released
  }
});

app.post('/list', async (req, res) => {
  console.log(req.body.AlbumID);
  res.render('trackList');
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
