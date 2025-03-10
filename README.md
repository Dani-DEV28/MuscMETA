# MusicMETA

[DB LAYOUT](docs/DBLAYOUT.md) for additional information.

---

## Table of Contents
- [Branching Guidelines](#branching-guidelines)
- [Agenda of Things Needed](#agenda-of-things-needed)
- [User Interface](#user-interface)
- [More Details](#for-more-details)
- [Build Commands](#build-commands)
- [Environment Setup](#environment-setup)
- [POST and GET Methods](#understand-post-and-get)
- [Current Implementation](#current-implementation)

---

## Branching Guidelines
- **Do not edit directly in `main`.** Always create a new branch.

### Create and Switch Branches
```bash
# Create a new branch
git branch [name]

# Switch to the new branch
git checkout [name]
```

### Keeping Your Branch Updated
```bash
# Check your current branch
git branch

# Switch from main to your branch
git checkout [yourBranch]

# Update all remote branches on your local machine
git fetch

# Merge the latest changes from main into your branch
git merge origin/main

# Add, commit, and push changes
git add .
git commit -m "merge"
git push origin [yourBranch]
```

---

## Agenda of Things Needed
- **CSS Styling:** Focus on mobile-first design
    - Three base colors: background, page wrapper, and font

- **SQL Database:**
    - Update the database to support image storage instead of links

- **UI and Pages to Implement:**
    - `Result.ejs` Page
    - `AlbumTrackList.ejs` Page
    - `SingleTrackInfo.ejs` Page

---

## User Interface
- Pass search input to search result pages
- Add a back button on every page except `Result.ejs`
- Display album covers in a grid layout
- Include a home button on every page except `Home.ejs`

---

## For More Details
- [INFO](https://docs.google.com/document/d/14A2q0xTq0EOgOX8tkzLCuTij3G9QEfDbVDOA2ZaI9_Y/edit?usp=sharing)

---

## Build Commands
```bash
# Install dependencies
npm install -y

# Launch test environment
npx nodemon
```

---

## Environment Setup
Create a `.env` file with the following content:
```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=music_meta
DB_PORT=3306
PORT=3000
```
Replace the `DB_PASSWORD` with the password used to set up the database.

---

## Understand POST and GET
- The home button uses the POST method to pass user data along the URL.

---

## Current Implementation
- **Back Button Code:**
```html
<button onclick="history.go(-1)">🔙 Go Back</button>
```

- **CSS Link:**
```html
<link rel="stylesheet" href="/styles/style.css">
```

- **Time Complexity:**
    - Nested loop complexity: O(n * m)
    - Consider refactoring to reduce time complexity

- **Page Navigation:**
```html
<div id="headerTitle">
    <form action="/" method="post">
        <button type="submit" id="navi">🔙 Go Home</button>
    </form>
    <h2>Album Track List</h2>
    <button onclick="history.go(-1)" id="navi">🔙 Go Back</button>
</div>
```

