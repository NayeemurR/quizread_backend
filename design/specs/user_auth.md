# UserAuthentication Concept

concept UserAuthentication [User]
purpose authenticate users
principle users must register and log in before using personalized features

state
  a set of Users with
    an _id Id
    an email String
    a passwordHash String
    a createdAt DateTime

actions
  register (email: String, passwordHash: String) : (userId: Id)
    requires email contains "@" and is unique; passwordHash non-empty
    effect inserts new user

  login (email: String, passwordHash: String) : (userId: Id)
    requires user exists and passwordHash matches
    effect returns userId
