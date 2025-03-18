// Get the express package 
const express = require('express');

const mariadb = require('mariadb');

// Configure the database connection
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'reservations'
});

// Connect to the database
async function connect() {
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err);
    }
}

// Instantiate an express (web) app
const app = express();

// Define a port number for the app to listen on
const PORT = 3000;

// Tell the app to encode data into JSON format
app.use(express.urlencoded({ extended: false }));

// Tell the app to use the "public" folder to serve static files
app.use(express.static('public'));

// Set your view (templating) engine to "EJS"
// (We use a templating engine to create dynamic web pages)
app.set('view engine', 'ejs');

// Define a "default" route, 
// e.g. jshmo.greenriverdev.com/reservation-app/
app.get('/', (req, res) => {
  console.log("Hello, world - server!");

  // Return home page
  res.render('home');
});

// Define a "confirm" route, using the GET method
app.get('/confirm', (req, res) => {
  // Send a response to the client
  res.send('You need to post to this page!');
});

// Define a "confirm" route, using the POST method
app.post('/confirm', async (req, res) => {
  console.log(req.body)

  // Get the data from the form that was submitted
  // from the body of the request object
  const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      toppings: req.body.toppings
  }

  console.log(data);

  // Connect to the database
  const conn = await connect();
  

  // Insert the data into the database
  await conn.query(`INSERT INTO users (firstName, lastName) 
    VALUES ('${data.firstName}', '${data.lastName}');`);

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

  const UITrackLength = req.body.UITrackLength || "0:00"
  const UIAlbumArtist = req.body.UIAlbumArtist || UIArtistName;
  const UITrackNum = req.body.UITrackNum || 1;
  const UITrackName = req.body.UITrackName || UIAlbumName
  const UIAlbumIMG = req.body.UIAlbumIMG || "/img/testIMG.png";

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


  // Display the confirm page, pass the data
  res.render('confirm', { details: data });
});

app.get('/confirmations', async (req, res) => {
  // Get the data from the database
  const conn = await connect();

  // Query the database
  const rows = await conn.query('SELECT * FROM users;');

  // Display the confirm page, pass the data
  res.render('confirmations', { confirmations: rows });
});

// Tell the app to listen for requests on the designated port
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
});
