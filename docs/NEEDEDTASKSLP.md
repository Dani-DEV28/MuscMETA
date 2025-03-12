# Low Priority Task for MusicMETA

## Implementing `trackList.ejs`

Currently, MusicMETA does not support displaying albums that contain multiple tracks.

### Expected Webpage Layout

The `trackList.ejs` page should follow this design:

<img src="img/WireFrame-TrackList.png">

### What Needs to Be Implemented?

To complete this feature, establish a database connection in `app.js` to retrieve album details based on `AlbumID`. Specifically, fetch the `AlbumName` and the total track count.

Once the track count is retrieved, dynamically generate a list of tracks on the `trackList.ejs` page. Each track entry should display:
- **Track Number (`trackNum`)**
- **Track Name (`TrackName`)**
- **Track Length (`track_length`)**

For additional details on database structure and queries, refer to the [DB LAYOUT](DBLAYOUT.md).

