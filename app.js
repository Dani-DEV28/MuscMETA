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

  // Validate user input
  if (!userInput || typeof userInput !== 'string') {
      return res.render('home', { error: "Invalid input" });
  }

  try {
      conn = await connect(); // Establish database connection

      // Search for artists or album artists
      const searchInput = await conn.query(
          "SELECT * FROM album_artist WHERE ArtistName = ? OR AlbumArtist = ?",
          [userInput, userInput]
      );

      // If no results are found, render the home page with an error message
      if (searchInput.length === 0) {
          return res.render('home', { error: "Artist not found" });
      }

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

      // Log results for debugging
      console.log("User Input:", userInput);
      console.log("Search Result:", searchInput);
      console.log("Album List:", retrieveAlbumList);

      // Render the searchResult view with the retrieved data
      res.render('searchResult', { retrieveAlbumList, userInput });
  } catch (err) {
      console.error("Database query error:", err);
      res.render('home', { error: "An error occurred while searching" });
  } finally {
      if (conn) conn.release(); // Ensure the connection is released
  }
});

app.post('/list', async (req, res) => {
    const albumID = req.body.AlbumID;
    const imgPath = req.body.AlbumImagePath;

    const trackNum = req.body.TrackNum || 1;

    let conn;
  
    // Validate inputs
    if (!albumID || !imgPath) {
        return res.render('home', { error: "Invalid album data" });
    }
  
    try {
      conn = await connect();
  
      // Retrieve the AlbumName for the given AlbumID
      const albumRetrieve = await conn.query(
          "SELECT AlbumName FROM album_single WHERE AlbumID = ?",
          [albumID]
      );
  
      // Check if the album was found
      if (albumRetrieve.length === 0) {
          return res.render('home', { error: "Album not found" });
      }
  
      // Extract the AlbumName from the first row
      const albumName = albumRetrieve[0].AlbumName;
  
      console.log("Album Name:", albumName);
      console.log("Album ID:", albumID);

      const trackRetrieve = await conn.query(
        "SELECT TrackName, TrackInfo FROM track_info WHERE AlbumID = ? AND TrackNum = ?",
        [albumID, trackNum]
      );

      let trackName = null;
      let trackInfo = null;

      if (trackRetrieve.length > 0) {
        trackName = trackRetrieve[0].TrackName;
        trackInfo = trackRetrieve[0].TrackInfo;
      }

      // console.log(trackRetrieve.length);
      // console.log(trackName);
      // console.log(trackInfo);
  
      // Render the trackList view with the image path and album name
      res.render('trackInfoList', { imgPath, albumName, trackName, trackInfo });
    } catch (err) {
      console.error("Error rendering track list:", err);
      res.render('home', { error: "An error occurred while loading the track list" });
    } finally {
      if (conn) conn.release(); // Release the connection
    }
});

app.get('/admin', async (req, res) => {
  res.render('admin');
});

app.post('/admin', async (req, res) => {
  // Extract values from the request body
  const {
    UIArtistName,
    UIAlbumName,
    UITrackInfo
  } = req.body;

  const UIAlbumArtist = req.body.UIAlbumArtist || UIArtistName;
  const UITrackNum = req.body.UITrackNum || 1;
  const UITrackName = req.body.UITrackName || UIAlbumName
  const UIAlbumIMG = req.body.UIAlbumIMG || "/img/testIMG.png";
  const UITrackLength = req.body.UITrackLength || "00:00:00"

  let conn;

  try {
    conn = await connect();

    const inputArtist = await conn.query(
      "INSERT IGNORE INTO album_artist (ArtistName, AlbumArtist) VALUES(?, ?);",
      [UIArtistName, UIAlbumArtist]
    );
  
    const artistResult = await conn.query(
      "SELECT SpecificID FROM album_artist WHERE ArtistName = ? AND AlbumArtist = ?;",
      [UIArtistName, UIAlbumArtist]
    );
  
    const specifiedID = artistResult[0].SpecificID;
  
    const inputAlbum = await conn.query(
      "INSERT INTO album_single (ArtistID, AlbumName, AlbumIMG, TrackCount) VALUES (?, ?, ?, ?)",
      [specifiedID, UIAlbumName, UIAlbumIMG, UITrackNum]
    );
  
    const albumResult = await conn.query(
      "SELECT AlbumID FROM album_single WHERE AlbumName = ? AND ArtistID = ?;",
      [UIAlbumName, specifiedID]
    );
  
    const albumID = albumResult[0].AlbumID;
  
    const inputTrackInfo = await conn.query(
      "INSERT INTO track_info (AlbumID, TrackNum, TrackName, TrackInfo, track_length) VALUES (?, ?, ?, ?, ?);",
      [albumID, UITrackNum, UITrackName, UITrackInfo, UITrackLength]
    );

    // Log the values to the console
    console.log('Artist Name:', UIArtistName);
    console.log('Album Artist:', UIAlbumArtist);
    console.log('Album Name:', UIAlbumName);
    console.log('Album Image URL:', UIAlbumIMG);
    console.log('Track Number:', UITrackNum);
    console.log('Track Name:', UITrackName);
    console.log('Track Length:', UITrackLength);
    console.log('Track Info:', UITrackInfo);
  
    // Render the admin page (or redirect as needed)
    res.render('admin');
  } catch (err) {
    console.error("Error rendering track list:", err);
    res.render('admin', { error: "An error occurred while loading the track list" });
  } finally {
    if (conn) conn.release(); // Release the connection
  }

  
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});