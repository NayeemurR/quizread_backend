import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import UserAuthenticationConcept from "@concepts/user_auth.ts";

// Test constants for user authentication

Deno.test("Principle: Register user, verify user exists, and login successfully", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[OP] Starting operational principle test");

    // 1. Register a new user
    const email = "alice@example.com";
    const passwordHash = "hashedpassword123";
    console.log("[OP] Registering user with email:", email);

    const registerResult = await authConcept.register({
      email,
      passwordHash,
    });
    assertNotEquals(
      "error" in registerResult,
      true,
      "User registration should not fail.",
    );
    const { userId } = registerResult as { userId: ID };
    assertExists(userId);
    console.log("[OP] Registered user with ID:", userId);

    // 2. Verify user exists
    const user = await authConcept._getUser({ userId });
    assertExists(user);
    assertEquals(user.email, email, "User email should match");
    assertEquals(
      user.passwordHash,
      passwordHash,
      "User password hash should match",
    );
    console.log("[OP] Verified user exists with correct details");

    // 3. Login with the same credentials
    console.log("[OP] Logging in with registered credentials");

    const loginResult = await authConcept.login({
      email,
      passwordHash,
    });
    assertNotEquals(
      "error" in loginResult,
      true,
      "User login should not fail.",
    );
    const { userId: loginUserId } = loginResult as { userId: ID };
    assertEquals(loginUserId, userId, "Login should return the same user ID");
    console.log("[OP] Login successful with correct user ID");
  } finally {
    await client.close();
  }
});

Deno.test("Action: register requires valid email and password hash", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[VARIANT] Testing invalid email format");

    const invalidEmailResult = await authConcept.register({
      email: "invalid-email",
      passwordHash: "password123",
    });
    assertEquals(
      "error" in invalidEmailResult,
      true,
      "Registering with invalid email should fail.",
    );
    console.log("[VARIANT] Invalid email correctly rejected");

    console.log("[VARIANT] Testing empty password hash");

    const emptyPasswordResult = await authConcept.register({
      email: "test@example.com",
      passwordHash: "",
    });
    assertEquals(
      "error" in emptyPasswordResult,
      true,
      "Registering with empty password hash should fail.",
    );
    console.log("[VARIANT] Empty password hash correctly rejected");

    console.log("[VARIANT] Testing whitespace-only password hash");

    const whitespacePasswordResult = await authConcept.register({
      email: "test@example.com",
      passwordHash: "   ",
    });
    assertEquals(
      "error" in whitespacePasswordResult,
      true,
      "Registering with whitespace-only password hash should fail.",
    );
    console.log("[VARIANT] Whitespace password hash correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: register requires unique email", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[VARIANT] Testing duplicate email registration");

    const email = "duplicate@example.com";
    const passwordHash1 = "password123";
    const passwordHash2 = "differentpassword";

    // Register first user
    const firstRegisterResult = await authConcept.register({
      email,
      passwordHash: passwordHash1,
    });
    assertNotEquals(
      "error" in firstRegisterResult,
      true,
      "First registration should succeed.",
    );
    console.log("[VARIANT] First registration successful");

    // Try to register with same email
    const duplicateResult = await authConcept.register({
      email,
      passwordHash: passwordHash2,
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Registering with duplicate email should fail.",
    );
    console.log("[VARIANT] Duplicate email correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: login requires existing user and correct password", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[VARIANT] Testing login with non-existent user");

    const nonExistentResult = await authConcept.login({
      email: "nonexistent@example.com",
      passwordHash: "password123",
    });
    assertEquals(
      "error" in nonExistentResult,
      true,
      "Logging in with non-existent user should fail.",
    );
    console.log("[VARIANT] Non-existent user correctly rejected");

    console.log("[VARIANT] Testing login with wrong password");

    // Register a user first
    const email = "test@example.com";
    const correctPassword = "correctpassword";
    const wrongPassword = "wrongpassword";

    const registerResult = await authConcept.register({
      email,
      passwordHash: correctPassword,
    });
    assertNotEquals(
      "error" in registerResult,
      true,
      "User registration should succeed.",
    );

    // Try to login with wrong password
    const wrongPasswordResult = await authConcept.login({
      email,
      passwordHash: wrongPassword,
    });
    assertEquals(
      "error" in wrongPasswordResult,
      true,
      "Logging in with wrong password should fail.",
    );
    console.log("[VARIANT] Wrong password correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: login succeeds with correct credentials", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[VARIANT] Testing successful login");

    const email = "success@example.com";
    const passwordHash = "correctpassword";

    // Register user
    const registerResult = await authConcept.register({
      email,
      passwordHash,
    });
    assertNotEquals(
      "error" in registerResult,
      true,
      "User registration should succeed.",
    );
    const { userId } = registerResult as { userId: ID };

    // Login with correct credentials
    const loginResult = await authConcept.login({
      email,
      passwordHash,
    });
    assertNotEquals(
      "error" in loginResult,
      true,
      "Login with correct credentials should succeed.",
    );
    const { userId: loginUserId } = loginResult as { userId: ID };
    assertEquals(
      loginUserId,
      userId,
      "Login should return the correct user ID",
    );
    console.log("[VARIANT] Successful login verified");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getUserByEmail retrieves user by email", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[VARIANT] Testing user retrieval by email");

    const email = "retrieve@example.com";
    const passwordHash = "password123";

    // Register user
    const registerResult = await authConcept.register({
      email,
      passwordHash,
    });
    assertNotEquals(
      "error" in registerResult,
      true,
      "User registration should succeed.",
    );
    const { userId } = registerResult as { userId: ID };

    // Retrieve user by email
    const user = await authConcept._getUserByEmail({ email });
    assertExists(user, "User should be found by email");
    assertEquals(user._id, userId, "Retrieved user should have correct ID");
    assertEquals(user.email, email, "Retrieved user should have correct email");
    assertEquals(
      user.passwordHash,
      passwordHash,
      "Retrieved user should have correct password hash",
    );
    console.log("[VARIANT] User retrieved by email successfully");

    // Test non-existent email
    const nonExistentUser = await authConcept._getUserByEmail({
      email: "nonexistent@example.com",
    });
    assertEquals(
      nonExistentUser,
      null,
      "Non-existent email should return null",
    );
    console.log("[VARIANT] Non-existent email correctly returns null");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getAllUsers retrieves all users sorted by creation date", async () => {
  const [db, client] = await testDb();
  const authConcept = new UserAuthenticationConcept(db);

  try {
    console.log("[VARIANT] Testing all users retrieval with sorting");

    // Register multiple users with small delays to ensure different timestamps
    const { userId: user1 } = (await authConcept.register({
      email: "first@example.com",
      passwordHash: "password1",
    })) as { userId: ID };

    // Small delay to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10));

    const { userId: user2 } = (await authConcept.register({
      email: "second@example.com",
      passwordHash: "password2",
    })) as { userId: ID };

    // Get all users (should be sorted by creation date, newest first)
    const allUsers = await authConcept._getAllUsers();
    assertEquals(allUsers.length, 2, "Should have two users");
    assertEquals(allUsers[0]._id, user2, "First user should be the newer one");
    assertEquals(allUsers[1]._id, user1, "Second user should be the older one");
    assertEquals(
      allUsers[0].email,
      "second@example.com",
      "First user email should match",
    );
    assertEquals(
      allUsers[1].email,
      "first@example.com",
      "Second user email should match",
    );

    console.log("[VARIANT] All users retrieved with correct sorting");
  } finally {
    await client.close();
  }
});
