document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".submitionEngine");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const trackLength = document.querySelector("#UITrackLength").value;
        const albumName = document.querySelector("#UIAlbumName").value;
        const artistName = document.querySelector("#UIArtistName").value;
        const trackNum = document.querySelector("#UITrackNum").value;
        
        const trackLengthPattern = /^\d{2}:\d{2}:\d{2}$/;
        if (!trackLengthPattern.test(trackLength)) {
            alert("Invalid track length format. Use HH:MM:SS.");
            return;
        }

        try {
            let albumCheck = await fetch("/checkAlbum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ artistName, albumName })
            });
            let albumResult = await albumCheck.json();
            if (albumResult.exists) {
                alert("Album already exists for this artist!");
                return;
            }

            let trackCheck = await fetch("/checkTrack", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ albumName, trackNum })
            });
            let trackResult = await trackCheck.json();
            if (trackResult.exists) {
                alert("Track number already in use for this album!");
                return;
            }

            form.submit();
        } catch (error) {
            console.error("Error during validation checks:", error);
        }
    });
});
