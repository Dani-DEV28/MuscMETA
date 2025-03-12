# Low Priority Task for MuscMETA

## Table of Contents

## Implementing the `trackList.ejs`

In the current iteration of the MuscMETA, there was not been an implementation for Album that have more than one track.

The ideal webpage look should have this layout:

<img src="img/WireFrame-TrackList.png">

### What need to implemented?

What need to be implemented is database connection to the `app.js` to retrieve the AlbumName, and track count based on a AlbumID.

After retrieving the trackcount, generate on the webpage a list of track for the `tracklist.ejs` page. You will need to populate the item in the track list with the correct `trackNum`, `TrackName`, and `track_length` from the database.

- Do refer to the [DB LAYOUT](docs/DBLAYOUT.md) for additional information about the Data Base Layout.