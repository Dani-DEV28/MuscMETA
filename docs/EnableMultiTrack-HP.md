# Challenge: Enable Multiple Tracks for an Album

## Objective
Modify the database structure, validation logic, and application code to allow multiple tracks to be assigned to a single album. This will involve updating the database schema, adjusting validation rules, and modifying the `app.js` code to handle multiple tracks.

## Guidelines for Students

### 1. Modify the Database Structure
**Current Limitation:** The current schema allows only one track per album due to the composite primary key on `AlbumID` and `TrackNum`.

**Required Changes:**
- Remove the composite primary key constraint on `track_info`.
- Add a new primary key (e.g., `TrackID`) to uniquely identify each track.
- Ensure `AlbumID` and `TrackNum` remain as foreign keys and apply unique constraints where necessary.

### 2. Update Validation Logic

#### **Frontend:**
- Allow users to input multiple tracks in the admin form.
- Validate each track's number, name, length, and info before submission.
- Ensure track numbers are unique within the same album.

#### **Backend:**
- Modify validation to check for duplicate track numbers within the same album.
- Ensure all tracks are validated before inserting them into the database.

### 3. Modify `app.js`

#### **Form Handling:**
- Update the `/admin` POST route to accept multiple tracks from the form.
- Process each track individually and insert them into the `track_info` table.

#### **Database Queries:**
- Modify queries to handle bulk insertion of tracks.
- Ensure proper error handling for duplicate tracks or invalid data.

### 4. Example Workflow

#### **Database Changes:**
- Add a `TrackID` column as the primary key in the `track_info` table.
- Update the schema to allow multiple tracks per album.

#### **Frontend Changes:**
- Add a dynamic form to allow users to input multiple tracks.
- Validate each track's data before submission.

#### **Backend Changes:**
- Update the `/admin` POST route to handle multiple tracks.
- Insert all tracks into the database in a single transaction.

## Key Considerations
- **Data Integrity:** Ensure that track numbers remain unique within the same album.
- **User Experience:** Provide clear feedback if a track number is duplicated or if validation fails.
- **Error Handling:** Handle errors gracefully and roll back transactions if any track insertion fails.

