UPDATE album_artist
SET AlbumArtist = ArtistName
WHERE AlbumArtist IS NULL;

INSERT INTO album_artist (ArtistName, AlbumArtist) VALUES('Raden', 'Hololive');

INSERT INTO album_single (ArtistID, AlbumName, AlbumIMG, TrackCount)
VALUES (1, 'Shinigami', '/img/Shinigami-raiden-Album.png', 1);

UPDATE album_single
SET AlbumIMG = '/img/Shinigami-raiden-Album.png'
WHERE AlbumName = 'Shinigami';

SELECT * FROM album_single