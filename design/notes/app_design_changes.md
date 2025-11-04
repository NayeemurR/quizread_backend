# App Design Changes

## Summary of Changes Made

### Added Concepts

I added a user authentication concept to handle user registration and login.

I also added a library concept that stores links to the user's books in Google Cloud Storage.

### Loading State

I added better loading states to the frontend. There were too many visual bugs when the production version of the backend would make calls to Google Cloud Storage, MongoDB, and Gemini. I wanted to make sure that the frontend was loading properly and that the user was not left waiting confused for a response.

### CORS

Since I am dealing with Google Cloud Storage, I had a ton of CORS issues on production. I had to set up a CORS policy on my Google Cloud Storage bucket to allow requests from my frontend.

### Syncs

I added syncs for the library, annotate, checkpoint quiz, and focus timer concepts. This is because I needed to make sure that certain routes were only accessible to authenticated users and that the backend was handling the requests properly.