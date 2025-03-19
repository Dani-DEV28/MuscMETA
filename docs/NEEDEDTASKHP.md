# Guidelines for Implementing Frontend and Backend Validation

## Objective
To prevent duplicate entries and invalid data submissions by implementing validation checks on both the frontend and backend.

## Frontend Validation Guidelines

1. **Validate User Inputs**
    - Ensure all required fields are filled out before submitting the form.
    - Validate the format of inputs (e.g., `track_length` should follow `HH:MM:SS`).

2. **Check for Duplicate Entries**
    - Before submitting the form, query the backend to check if:
      - The album name already exists for the given artist.
      - The track number is already in use for the given album.

3. **Provide User Feedback**
    - Display error messages dynamically on the form if:
      - A duplicate album or track is detected.
      - An input field is invalid or empty.

4. **Use Asynchronous Requests**
    - Use `fetch` or `axios` to send requests to the backend for validation checks.
    - Prevent form submission until all validations pass.

5. **Example Workflow**
    - Add event listeners to the form to trigger validation on submission.
    - Query the backend for duplicate entries using API endpoints (e.g., `/checkAlbum`, `/checkTrack`).
    - Display error messages if validations fail.
    - Submit the form only if all validations pass.

## Backend Validation Guidelines

1. **Validate Input Data**
    - Check for required fields and ensure they are not empty.
    - Validate the format of inputs (e.g., `track_length` must be in `HH:MM:SS` format).

2. **Check for Duplicate Entries**
    - Before inserting data into the database, query the relevant tables to check for duplicates:
      - For albums: Ensure the album name does not already exist for the given artist.
      - For tracks: Ensure the track number is not already in use for the given album.

3. **Create Validation Endpoints**
    - Add API endpoints to handle validation requests from the frontend:
      - `/checkAlbum`: Checks if an album already exists for a given artist.
      - `/checkTrack`: Checks if a track number is already in use for a given album.

4. **Handle Errors Gracefully**
    - Return meaningful error messages to the frontend if validations fail.
    - Use appropriate HTTP status codes (e.g., `400` for bad requests, `409` for conflicts).

5. **Example Workflow**
    - Create endpoints to handle validation requests.
    - Query the database to check for duplicates or invalid data.
    - Return a response indicating whether the data is valid or not.
    - Proceed with data insertion only if all validations pass.

## Key Considerations
- **Frontend-Backend Communication**: Ensure the frontend and backend work together seamlessly to validate data.
- **User Experience**: Provide clear and immediate feedback to users when errors occur.
- **Data Integrity**: Prevent invalid or duplicate data from being inserted into the database.

