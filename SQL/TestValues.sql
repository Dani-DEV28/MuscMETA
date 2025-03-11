-- Active: 1741200637636@@127.0.0.1@3306@music_meta
-- Step 1: Update AlbumArtist for existing rows (if any)
UPDATE album_artist
SET AlbumArtist = ArtistName
WHERE AlbumArtist IS NULL;

-- Step 2: Insert data into album_artist (ensure no duplicates)
INSERT IGNORE INTO album_artist (ArtistName, AlbumArtist) VALUES('Raden', 'Hololive');
INSERT IGNORE INTO album_artist (ArtistName, AlbumArtist) VALUES('FuwaMoco', 'Hololive');

INSERT IGNORE INTO album_artist (ArtistName, AlbumArtist) VALUES('Hakos Baelz', 'Hololive');

-- Step 3: Insert data into album_single (use subqueries to fetch ArtistID)
INSERT INTO album_single (ArtistID, AlbumName, AlbumIMG, TrackCount)
VALUES (
    (SELECT SpecificID FROM album_artist WHERE ArtistName = 'Raden' AND AlbumArtist = 'Hololive'),
    'Shinigami',
    '/img/Shinigami-raiden-Album.png',
    1
);

INSERT INTO album_single (ArtistID, AlbumName, AlbumIMG, TrackCount)
VALUES (
    (SELECT SpecificID FROM album_artist WHERE ArtistName = 'FuwaMoco' AND AlbumArtist = 'Hololive'),
    'KAIBUTSU',
    '/img/MonsterFuwaMoco.png',
    1
);

INSERT INTO album_single (ArtistID, AlbumName, AlbumIMG, TrackCount)
VALUES (
    (SELECT SpecificID FROM album_artist WHERE ArtistName = 'Hakos Baelz' AND AlbumArtist = 'Hololive'),
    'Ameotome',
    '/img/ame.jpg',
    1
);

-- Step 4: Update AlbumIMG for a specific album (filter by ArtistID and AlbumName)
UPDATE album_single
SET AlbumIMG = '/img/Shinigami-raiden-Album.png'
WHERE AlbumName = 'Shinigami'
AND ArtistID = (SELECT SpecificID FROM album_artist WHERE ArtistName = 'Raden' AND AlbumArtist = 'Hololive');

-- Step 5: Verify data
SELECT * FROM album_single;
SELECT * FROM album_artist;
SELECT * FROM track_info;