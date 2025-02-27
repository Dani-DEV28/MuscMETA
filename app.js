// app.js
import express from "express"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve static files from the 'public' directory
app.use(express.static('public'));

// set the view engine for out application
app.set('view engine', 'ejs');

const PORT = 3000;

app.get('/', (req, res) => {

    // Send our home page as a response to the client
    res.render('home');
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

