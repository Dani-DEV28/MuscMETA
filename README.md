# MusicMETA #
[DB LAYOUT](docs/DBLAYOUT.md) for additional information .
<br>

# List of things #
- Be sure to make a brach, do not edit in main <br>
    - `git branch [name]`
    - `git checkout [name]` <-to switch to the new branch
<br>
Afterward, you will be working on your own branch, which can be broken while `main` remains stable. You can optionally merge new features from the `main` branch.

**Instruction:**  

- `git branch` ← Check if you are on `main` or not  
- `git checkout [yourBranch]` ← Switch from `main` to the branch you made  
- `git fetch` ← Update all remote branches on your local machine  
- `git merge origin/main` ← Update your local branch with new changes from `main`  
- Then just:  
  ```bash
  git add .
  git commit -m "merge"
  git push origin [yourBranch]
<br>
Agenda of thing needed: <br>
- CSS styling, focus on Mobile look first
    - Three base color, default-background, wrapper for the main page, and font
- SQL database
    - update the db to support img, instead of link
- and the UI, and pages need to be added
    - Result.ejs Page
    - AlbumTrackList.ejs page
    - SingleTrackInfo.ejs page

# User Interface #
List:
- passing the search input to the search result pages
- having a back button on every page, except result.ejs
- loading Album Cover in Grid Area
- having Home button on every page except home.ejs

# For more detail #
- [INFO] (https://docs.google.com/document/d/14A2q0xTq0EOgOX8tkzLCuTij3G9QEfDbVDOA2ZaI9_Y/edit?usp=sharing)

# Build Commands #
- npm install -y
    - This is for setup to test
- npx nodemon
    - This is for launching test enviroment to see changes
- setting up .env file
    - ``DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=music_meta
DB_PORT=3306
PORT=3000``
    The password need to be replace with the one you use to setup the DB_HOST

# Understand POST and GET #
- home button use the POST that way user data is passed along the URL

# Current Implementation #
- Back Button Code:
    `<button onclick="history.go(-1)">🔙 Go Back</button>`
- CSS link:
    `<link rel="stylesheet" href="/styles/style.css">`
- For Loop nest timecomplexity of O(n*m) -> need to late reduce time comp
- Page navi:
    ```<div id = headerTitle>
        <form action="/" method="post">
            <button type="submit" id = navi>🔙 Go Home</button>
        </form>
        <H2>Album Track List</H2>
        <button onclick="history.go(-1)" id = navi>🔙 Go Back</button>
    </div>```