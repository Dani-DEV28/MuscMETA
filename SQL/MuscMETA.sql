DROP DATABASE IF EXISTS music_meta;
CREATE DATABASE IF NOT EXISTS music_meta;
USE music_meta;

-- Table for artists
CREATE TABLE album_artist(
    SpecificID INT AUTO_INCREMENT PRIMARY KEY,
    ArtistName VARCHAR(255) NOT NULL,
    AlbumArtist VARCHAR(255), -- Combined artist and album artist
    ItemCount INT DEFAULT 0,
    CONSTRAINT unique_artist UNIQUE (ArtistName, AlbumArtist) -- Prevent duplicates
);

-- Table for albums
CREATE TABLE album_single(
    ArtistID INT NOT NULL,
    AlbumName VARCHAR(255) NOT NULL,
    AlbumID INT AUTO_INCREMENT PRIMARY KEY,
    AlbumIMG VARCHAR(512), -- Increased length for image paths
    TrackCount INT DEFAULT 0,
    FOREIGN KEY (ArtistID) REFERENCES album_artist(SpecificID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT unique_album UNIQUE (ArtistID, AlbumName) -- Prevent duplicate albums per artist
);

-- Table for tracks
CREATE TABLE track_info(
    AlbumID INT NOT NULL,
    TrackNum INT NOT NULL,
    TrackName VARCHAR(255) NOT NULL,
    TrackInfo TEXT,
    track_length TIME,
    PRIMARY KEY (AlbumID, TrackNum),
    FOREIGN KEY (AlbumID) REFERENCES album_single(AlbumID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes for faster searches
CREATE INDEX idx_artist_name ON album_artist(ArtistName);
CREATE INDEX idx_album_name ON album_single(AlbumName);
CREATE INDEX idx_track_name ON track_info(TrackName);

-- Triggers to update ItemCount in album_artist
CREATE TRIGGER update_item_count
AFTER INSERT ON album_single
FOR EACH ROW
BEGIN
    UPDATE album_artist
    SET ItemCount = ItemCount + 1
    WHERE SpecificID = NEW.ArtistID;
END;

CREATE TRIGGER decrease_item_count
AFTER DELETE ON album_single
FOR EACH ROW
BEGIN
    UPDATE album_artist
    SET ItemCount = GREATEST(ItemCount - 1, 0) -- Ensure ItemCount doesn't go below 0
    WHERE SpecificID = OLD.ArtistID;
END;

-- Triggers to update TrackCount in album_single
CREATE TRIGGER update_track_count
AFTER INSERT ON track_info
FOR EACH ROW
BEGIN
    UPDATE album_single
    SET TrackCount = TrackCount + 1
    WHERE AlbumID = NEW.AlbumID;
END;

CREATE TRIGGER decrease_track_count
AFTER DELETE ON track_info
FOR EACH ROW
BEGIN
    UPDATE album_single
    SET TrackCount = TrackCount - 1
    WHERE AlbumID = OLD.AlbumID;
END;

DROP TRIGGER IF EXISTS update_item_count;
DROP TRIGGER IF EXISTS update_track_count;