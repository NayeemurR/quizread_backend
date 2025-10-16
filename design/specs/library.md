# Library Concept

concept Library [User, Book]
purpose store metadata about books a user owns/reads with links to Google Cloud storage
principle users can add, list, get, and remove their books; books are stored as PDFs in Google Cloud

state
  a set of Books with
    an _id Id
    an ownerId Id
    a title String
    a totalPages Number
    a storageUrl String  // URL to Google Cloud storage where PDF is stored
    a createdAt DateTime

actions
  addBook (ownerId: Id, title: String, totalPages: Number, storageUrl: String) : (bookId: Id)
    requires title non-empty; totalPages > 0; storageUrl non-empty
    effect inserts a book with link to Google Cloud storage

  getBook (bookId: Id) : (exists: Boolean)
    effect returns whether book exists (for tests)

  listBooks (ownerId: Id) : (bookIds: set Id)
    effect returns books owned by user

  removeBook (ownerId: Id, bookId: Id)
    requires book exists and ownerId matches
    effect deletes the book
