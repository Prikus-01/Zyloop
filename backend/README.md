# Social Media Backend

A Node.js backend API for a social media platform with user authentication, content creation, and social features.

## Setup Instructions

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create a `.env` file in the root directory with the following variables:

    ```
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=social_media_db
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    JWT_SECRET=your_jwt_secret_key
    ```

3. Set up PostgreSQL database and run the setup script:
    ```bash
    npm run setup:db
    ```

## How to Run

### Development mode with auto-reload:

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

## Available npm Scripts

-   `npm start` - Start the application in production mode
-   `npm run dev` - Start the application in development mode with nodemon
-   `npm run start:verbose` - Start with verbose logging
-   `npm run start:critical` - Start with critical-only logging
-   `npm run setup:db` - Set up database tables

## Project File Structure

```text
social media backend/
├─ docs/
│  ├─ api-collection.json
│  ├─ development-guide.md
│  └─ updated-Social-Media-Backend-API.postman_collection
├─ scripts/
│  └─ setup-database.js
├─ sql/
│  └─ schema.sql
├─ src/
│  ├─ app.js
│  ├─ controllers/
│  │  ├─ auth.js
│  │  ├─ users.js
│  │  ├─ posts.js
│  │  ├─ comments.js
│  │  └─ likes.js
│  ├─ middleware/
│  │  └─ auth.js
│  ├─ models/
│  │  ├─ user.js
│  │  ├─ post.js
│  │  ├─ comment.js
│  │  ├─ like.js
│  │  └─ follow.js
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ users.js
│  │  ├─ posts.js
│  │  ├─ comments.js
│  │  └─ likes.js
│  └─ utils/
│     ├─ database.js
│     ├─ logger.js
│     ├─ validation.js
│     └─ (other helpers)
├─ .env.example
├─ package.json
└─ README.md
```

- **`src/app.js`**: Express setup, middleware, route mounting, error handling, and server start.
- **`src/routes/`**: HTTP route definitions; each file mounts under a base path.
- **`src/controllers/`**: Business logic for each route.
- **`src/models/`**: Data-access layer for `user`, `post`, `comment`, `like`, `follow`.
- **`src/middleware/auth.js`**: JWT auth middleware `authenticateToken`.
- **`src/utils/`**: `database` connection, `logger`, and `validation` schemas/helpers.
- **`scripts/setup-database.js`** and **`sql/schema.sql`**: DB initialization.

## API Overview

- **Base URL**: `http://localhost:${PORT || 3000}/api`
- **Auth**: Most endpoints require JWT via `Authorization: Bearer <token>`.
- Mounted in `src/app.js`:
  - **Auth** → `/api/auth`
  - **Users** → `/api/users`
  - **Posts** → `/api/posts`
  - **Likes** → `/api/likes`
  - **Comments** → `/api/comments`

### Auth (`/api/auth`)

- **POST** `/register` — Register a new user. Body validated by `userRegistrationSchema`.
- **POST** `/login` — Login and receive JWT. Body validated by `userLoginSchema`.
- **GET** `/profile` — Get current user profile. Requires auth.

### Users (`/api/users`)

- **POST** `/follow/:id` — Follow a user. Requires auth.
- **DELETE** `/unfollow/:id` — Unfollow a user. Requires auth.
- **GET** `/following/:id` — List users that `:id` is following. Requires auth.
- **GET** `/followers/:id` — List followers of `:id`. Requires auth.
- **GET** `/stats/:id` — Follow stats for `:id`. Requires auth.
- **POST** `/search` — Search users. Requires auth. Body validated by `searchUserSchema`.
- **GET** `/profile/:id` — Public profile for `:id`. Requires auth.
- **GET** `/:id` — Get user by id. Requires auth.

### Posts (`/api/posts`)

- **POST** `/` — Create a post. Requires auth. Body validated by `createPostSchema`.
- **GET** `/my` — Get current user's posts. Requires auth.
- **GET** `/post/:post_id` — Get a post by id. Requires auth.
- **GET** `/user/:user_id` — Get posts by user. Requires auth.
- **DELETE** `/:post_id` — Delete a post. Requires auth.
- **PUT** `/:post_id` — Update a post. Requires auth. Body validated by `updatePostSchema`.
- **GET** `/feed` — Get feed posts from followed users. Requires auth.
- **GET** `/search/:search` — Search posts by content. Requires auth.

### Comments (`/api/comments`)

- **POST** `/` — Create a comment. Requires auth. Body validated by `createCommentSchema`.
- **PUT** `/:comment_id` — Update a comment. Requires auth. Body validated by `updateCommentSchema`.
- **DELETE** `/:comment_id` — Delete a comment. Requires auth.
- **GET** `/post/:post_id` — Get comments for a post. Requires auth.
- **GET** `/:comment_id` — Get a comment by id. Requires auth.

### Likes (`/api/likes`)

- **POST** `/:post_id` — Like a post. Requires auth.
- **DELETE** `/:post_id` — Unlike a post. Requires auth.
- **GET** `/post/:post_id` — Get likes for a post. Requires auth.
- **GET** `/user/:user_id` — Get posts liked by a user. Requires auth.

### Health

- **GET** `/health` — Service health check (no auth). Returns `{ status: "OK", timestamp }`.

## Validation and Auth

- **Validation**: Requests are validated via `src/utils/validation.js` with helpers like `validateRequest()` and schemas such as `userRegistrationSchema`, `userLoginSchema`, `createPostSchema`, `updatePostSchema`, `createCommentSchema`, `updateCommentSchema`.
- **Authentication**: JWT middleware `authenticateToken` in `src/middleware/auth.js` protects endpoints as noted above.

## Sample Requests

Note: Replace `TOKEN` with a valid JWT from the login endpoint.

```bash
# Auth - Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "StrongP@ssw0rd"
  }'

# Auth - Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "StrongP@ssw0rd"
  }'

# Posts - Create
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello world!",
    "media_url": null
  }'

# Posts - Feed
curl -X GET http://localhost:3000/api/posts/feed \
  -H "Authorization: Bearer TOKEN"

# Users - Follow
curl -X POST http://localhost:3000/api/users/follow/USER_ID \
  -H "Authorization: Bearer TOKEN"

# Comments - Create
curl -X POST http://localhost:3000/api/comments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "POST_ID",
    "content": "Nice post!"
  }'

# Likes - Like a post
curl -X POST http://localhost:3000/api/likes/POST_ID \
  -H "Authorization: Bearer TOKEN"

# Health
curl -X GET http://localhost:3000/health
```

Minimal example responses:

```json
// Login success
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}

// Health
{ "status": "OK", "timestamp": "2025-01-01T00:00:00.000Z" }
```

To use Postman, import `docs/updated-Social-Media-Backend-API.postman_collection`.

## Common Error Responses

- **400 Bad Request**
  - Validation failed. Response:
  ```json
  { "error": "Validation error", "details": ["<field> is required" ] }
  ```

- **401 Unauthorized**
  - Missing/invalid token or not logged in. Response:
  ```json
  { "error": "Unauthorized" }
  ```

- **404 Not Found**
  - Resource or route not found. Response:
  ```json
  { "error": "Route not found" }
  ```

- **500 Internal Server Error**
  - Unhandled errors. In development, `details` may be included. Response:
  ```json
  { "error": "Internal server error" }
  ```
