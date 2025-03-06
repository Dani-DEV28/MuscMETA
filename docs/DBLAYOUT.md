MuscMETA db

Tables

Album Artist
- SpecificID
- ArtistName
- Item Count

AlbumSingle
- ArtistID <-> SpecificID from AblumArtist
- AlbumName
- AlbumID
- AlbumIMG
- TrackCount

TrackInfo
- AlbumID <-> Shared from AblumSingle
- TrackNum
- TrackName
- TrackInfo