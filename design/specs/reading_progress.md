concept ReadingProgress [User, Book]
purpose track reading state and compute engagement triggers
principle as user advances pages, the concept decides when to trigger quiz/annotation (booleans only)

state
  a set of ReadingSessions with
    an _id Id
    a userId Id
    a bookId Id
    a currentPage Number
    a totalPages Number
    a lastQuizPage Number
    a lastAnnotationPage Number
    a quizInterval Number
    an annotationInterval Number
    a startTime DateTime
    a totalReadingTimeMinutes Number
    an isActive Boolean

actions
  initializeProgress (userId: Id, bookId: Id, totalPages: Number, quizInterval: Number, annotationInterval: Number) : (sessionId: Id)
    requires totalPages > 0; quizInterval > 0; annotationInterval > 0
    effect creates a session with currentPage=1; isActive=true

  updateProgress (sessionId: Id, newPage: Number)
    requires session exists; newPage > currentPage; newPage <= totalPages
    effect sets currentPage=newPage

  triggerQuiz (sessionId: Id) : (shouldTrigger: Boolean)
    effect returns (currentPage - lastQuizPage) >= quizInterval

  triggerAnnotation (sessionId: Id) : (shouldTrigger: Boolean)
    effect returns (currentPage - lastAnnotationPage) >= annotationInterval

  recordQuizTriggered (sessionId: Id)
    requires session exists
    effect sets lastQuizPage = currentPage

  recordAnnotationTriggered (sessionId: Id)
    requires session exists
    effect sets lastAnnotationPage = currentPage

  pauseReading (sessionId: Id)
    requires isActive=true
    effect sets isActive=false and increments totalReadingTimeMinutes by elapsed since startTime

  resumeReading (sessionId: Id)
    requires isActive=false
    effect sets isActive=true and sets startTime=now
