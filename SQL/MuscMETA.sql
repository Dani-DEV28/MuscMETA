
CREATE DATABASE IF NOT EXISTS music_meta;

USE music_meta;

CREATE TABLE album_artist(
    SpecificID INT AUTO_INCREMENT PRIMARY KEY,
    ArtistName VARCHAR(255) NOT NULL,
    ItemCount INT DEFAULT 0
);

ALTER TABLE album_artist ADD COLUMN AlbumArtist VARCHAR(255);

CREATE TABLE album_single(
    ArtistID INT NOT NULL,
    AlbumName VARCHAR(255) NOT NULL,
    AlbumID INT AUTO_INCREMENT PRIMARY KEY,
    AlbumIMG VARCHAR(255),
    TrackCount INT DEFAULT 0,
    FOREIGN KEY (ArtistID) REFERENCES album_artist(SpecificID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE track_info(
    AlbumID INT NOT NULL,
    TrackNum INT NOT NULL,
    TrackName VARCHAR(255) NOT NULL,
    TrackInfo TEXT,
    PRIMARY KEY (AlbumID, TrackNum),
    FOREIGN KEY (AlbumID) REFERENCES album_single(AlbumID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

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
    SET ItemCount = ItemCount - 1
    WHERE SpecificID = OLD.ArtistID;
END;