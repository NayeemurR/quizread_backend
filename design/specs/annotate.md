# Annotate Concept

concept Annotate [User, Book, Content]
purpose persist reader reflections to encourage active reading
principle prompt users periodically to jot key ideas; store and retrieve annotations

state
  a set of Annotations with
    an _id Id
    a userId Id
    a bookId Id
    a content String
    a keyIdeas String
    a createdAt DateTime

actions
  saveAnnotation (userId: Id, bookId: Id, content: String, keyIdeas: String) : (annotationId: Id)
    requires keyIdeas non-empty
    effect saves annotation and returns annotationId

  getAnnotationsForBook (userId: Id, bookId: Id) : (annotations: set Annotation)
    effect returns all annotations for a specific user and book

