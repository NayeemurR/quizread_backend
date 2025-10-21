# Concept Design Changes

## Summary of Changes Made

### CheckpointQuiz

One design change I made here was instead of storing the quiz's answer as a string, I instead store the index of the correct answer. This is because it makes it easier to validate the answer and it's more efficient to store. I also specify that the answers array should be of length 4.

I also made sure to call the Gemini API to generate the quiz. I use the Gemini LLM class to call the API and return the result as a string. I then extract the JSON from the result and parse it into a JSON object. I then validate the JSON object and return the quizId.

I added a getQuizContext action to the CheckpointQuiz concept. This is because I need to extract the text from the PDF to generate the quiz. I also added a createQuizFromPDF action to the CheckpointQuiz concept. This is because I need to create a quiz from the PDF content.

I changed what gets returned from the createQuiz action. Instead of returning the quizId, I now return the full quiz object. This is because I need to return the quiz object to the frontend to display the quiz. It's easier to do it in one action than the frontend having to call two actions to get the quiz object.

### Annotate

I decided to not implement the promptAnnotation action. This is because I feel as if this is a more frontend related action that can be handled with a sync. Since this assignment is for the backend, I decided to not implement it.

### FocusTimer

I listened to the feedback given on my assignment 2 and drastically reduced the complexity of the timer. I was told that FocusTimer is a good general concept, but the actual implementation was way too app-specific. All a timer needs to know is the start time and countdown. It doesn't need to know the user, the book, or the pages. That stuff can be taken care of in a sync.

### Library

I added a prepareUpload action to the Library concept. This is because I need to generate a signed URL to upload the book to Google Cloud Storage. I also added a cleanupFailedUpload action to the Library concept. This is because if the upload fails, I need to delete the file from Google Cloud Storage.

Removed the totalPages field from the Library concept. This is because I don't need to know the total pages of the book to add it to the library. I only need to know the storage URL to add it to the library.