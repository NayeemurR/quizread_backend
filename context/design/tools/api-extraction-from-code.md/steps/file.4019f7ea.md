---
timestamp: 'Mon Oct 20 2025 18:54:43 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185443.9f90ea57.md]]'
content_id: 4019f7ea1264dc43bc1f7c83bf70cb74828b9551ac62d06b0282eb2e79f08ede
---

# file: src/concepts/annotate.ts

```typescript
import { Collection, Db } from "mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Annotate" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Annotation = ID;

/**
 * State: A set of Annotations with user, content, key ideas, and timestamp.
 */
interface AnnotationDoc {
  _id: Annotation;
  userId: User;
  content: string;
  keyIdeas: string;
  createdAt: Date;
}

/**
 * @concept Annotate
 * @purpose Persist reader reflections to encourage active reading
 */
export default class AnnotateConcept {
  annotations: Collection<AnnotationDoc>;

  constructor(private readonly db: Db) {
    this.annotations = this.db.collection(PREFIX + "annotations");
  }

  /**
   * Action: Saves an annotation with user, content, and key ideas.
   * @requires keyIdeas must be non-empty
   * @effects A new annotation is created and its ID is returned
   */
  async saveAnnotation(
    { userId, content, keyIdeas }: {
      userId: User;
      content: string;
      keyIdeas: string;
    },
  ): Promise<{ annotationId: Annotation } | { error: string }> {
    if (!keyIdeas || keyIdeas.trim().length === 0) {
      return { error: "keyIdeas cannot be empty" };
    }

    const annotationId = freshID() as Annotation;
    await this.annotations.insertOne({
      _id: annotationId,
      userId,
      content,
      keyIdeas,
      createdAt: new Date(),
    });

    return { annotationId };
  }

  /**
   * Query: Retrieves all annotations for a specific user and content.
   */
  async _getUserAnnotations(
    { userId, content }: { userId: User; content: string },
  ): Promise<AnnotationDoc[]> {
    return await this.annotations
      .find({ userId, content })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Query: Retrieves all annotations by a specific user.
   */
  async _getAllUserAnnotations(
    { userId }: { userId: User },
  ): Promise<AnnotationDoc[]> {
    return await this.annotations
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
  }
}

```

## CheckpointQuiz

Specification:
