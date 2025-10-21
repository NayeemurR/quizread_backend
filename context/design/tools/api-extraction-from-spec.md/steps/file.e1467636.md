---
timestamp: 'Mon Oct 20 2025 17:43:16 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_174316.ec5a3239.md]]'
content_id: e14676368bc960d08e2b4d2312f60d96e3c4e77a3ca0200350c5e1faae12a1a1
---

# file: src/concepts/user\_auth.ts

```typescript
import { Collection, Db } from "mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "UserAuthentication" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type AuthUser = ID;

/**
 * State: A set of Users with authentication information.
 */
interface UserDoc {
  _id: AuthUser;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

/**
 * @concept UserAuthentication
 * @purpose Authenticate users
 */
export default class UserAuthenticationConcept {
  users: Collection<UserDoc>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
  }

  /**
   * Action: Registers a new user with email and password hash.
   * @requires email must contain "@" and be unique
   * @requires passwordHash must be non-empty
   * @effects Inserts new user
   */
  async register(
    { email, passwordHash }: { email: string; passwordHash: string },
  ): Promise<{ userId: User } | { error: string }> {
    if (!email || !email.includes("@")) {
      return { error: "email must contain @" };
    }
    if (!passwordHash || passwordHash.trim().length === 0) {
      return { error: "passwordHash cannot be empty" };
    }

    // Check if user already exists
    const existingUser = await this.users.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const userId = freshID() as User;
    await this.users.insertOne({
      _id: userId,
      email,
      passwordHash,
      createdAt: new Date(),
    });

    return { userId };
  }

  /**
   * Action: Logs in a user with email and password hash.
   * @requires user must exist
   * @requires passwordHash must match
   * @effects Returns userId
   */
  async login(
    { email, passwordHash }: { email: string; passwordHash: string },
  ): Promise<{ userId: User } | { error: string }> {
    // Find user by email
    const user = await this.users.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }

    // Verify password hash
    if (user.passwordHash !== passwordHash) {
      return { error: "Invalid password" };
    }

    return { userId: user._id };
  }

  /**
   * Query: Retrieves a user by their ID.
   */
  async _getUser(
    { userId }: { userId: User },
  ): Promise<UserDoc | null> {
    return await this.users.findOne({ _id: userId });
  }

  /**
   * Query: Retrieves a user by their email.
   */
  async _getUserByEmail(
    { email }: { email: string },
  ): Promise<UserDoc | null> {
    return await this.users.findOne({ email });
  }

  /**
   * Query: Retrieves all users.
   */
  async _getAllUsers(): Promise<UserDoc[]> {
    return await this.users.find({}).sort({ createdAt: -1 }).toArray();
  }
}

```
