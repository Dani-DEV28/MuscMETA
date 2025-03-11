# SQL Database Topology

## Overview
This database is designed to manage music albums, artists, and track information efficiently. The schema consists of three primary tables:
- `album_artist`: Stores artist information.
- `album_single`: Stores album details, linked to an artist.
- `track_info`: Stores track details, linked to an album.

## Database Schema

### `album_artist` (Artist Table)
This table holds information about artists and their associated albums.

#### Columns:
- `SpecificID` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique identifier for an artist.
- `ArtistName` (VARCHAR(255), NOT NULL): The name of the artist.
- `AlbumArtist` (VARCHAR(255)): A field that combines artist and album artist names.
- `ItemCount` (INT, DEFAULT 0): The number of albums associated with the artist.
- `unique_artist` (UNIQUE CONSTRAINT): Ensures uniqueness of an artist based on `ArtistName` and `AlbumArtist`.

### `album_single` (Album Table)
Stores album details and links them to an artist.

#### Columns:
- `ArtistID` (INT, NOT NULL, FOREIGN KEY): References `SpecificID` from `album_artist`.
- `AlbumName` (VARCHAR(255), NOT NULL): The name of the album.
- `AlbumID` (INT, PRIMARY KEY, AUTO_INCREMENT): Unique identifier for an album.
- `AlbumIMG` (VARCHAR(512)): Stores the album cover image path.
- `TrackCount` (INT, DEFAULT 0): The number of tracks in the album.
- `unique_album` (UNIQUE CONSTRAINT): Ensures an artist cannot have duplicate albums.
- **Foreign Key Constraint**: Ensures that when an artist is deleted, their albums are also deleted (`ON DELETE CASCADE` and `ON UPDATE CASCADE`).

### `track_info` (Track Table)
Stores track details and links them to an album.

#### Columns:
- `AlbumID` (INT, NOT NULL, FOREIGN KEY): References `AlbumID` from `album_single`.
- `TrackNum` (INT, NOT NULL): The track number within an album.
- `TrackName` (VARCHAR(255), NOT NULL): The name of the track.
- `TrackInfo` (TEXT): Additional information about the track.
- `track_length` (TIME): Duration of the track.
- **Primary Key**: A composite key on (`AlbumID`, `TrackNum`) ensures each track number is unique within an album.
- **Foreign Key Constraint**: Ensures that when an album is deleted, its tracks are also deleted (`ON DELETE CASCADE` and `ON UPDATE CASCADE`).

## Relationship Diagram
```
 album_artist (SpecificID) 1 --- * album_single (ArtistID)
 album_single (AlbumID) 1 --- * track_info (AlbumID)
```
- An **artist** can have multiple **albums**.
- An **album** can have multiple **tracks**.
- If an **artist** is deleted, their albums and tracks are also deleted due to cascading constraints.

## Notes
- The database structure ensures data integrity and prevents duplicate entries.
- Cascading delete operations help maintain consistency when deleting artists or albums.
- `track_length` is stored as a `TIME` datatype, allowing easy manipulation of durations.

This schema is optimized for relational queries related to music albums and tracks.

