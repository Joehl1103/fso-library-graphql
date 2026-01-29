# Library GraphQL Application

A full-stack library management application with GraphQL API, real-time subscriptions, and user authentication.

🔗 **Live Demo:** [fso-library-graphql.vercel.app](https://fso-library-graphql.vercel.app/)

## Tech Stack

**Backend:**

- Apollo Server 5
- GraphQL with Subscriptions (graphql-ws)
- MongoDB / Mongoose
- JWT Authentication

**Frontend:**

- React 18
- Apollo Client 4
- Redux Toolkit
- React Router
- React Select

## Project Structure

```
library-graphql/
├── library-backend/
│   ├── models/         # Mongoose schemas (Author, Book, User)
│   ├── schema.js       # GraphQL type definitions
│   ├── resolvers.js    # Query, Mutation, Subscription handlers
│   ├── helpers.js      # Utility functions
│   └── index.js        # Server setup with WebSocket
└── library-frontend/
    └── src/
        ├── components/   # React components
        ├── reducers/     # Redux slices
        ├── queries.js    # GraphQL queries and mutations
        └── store.js      # Redux store config
```

## Features

- Browse books and authors
- Filter books by genre
- Add new books and authors
- Edit author birth years
- User authentication (login/register)
- Personalized book recommendations
- Real-time updates when new books are added (subscriptions)

## GraphQL Schema

### Queries

- `bookCount` - Total number of books
- `authorCount` - Total number of authors
- `allBooks(author, genre)` - List books with optional filters
- `allAuthors` - List all authors with book counts
- `allUsers` - List all users
- `me` - Current authenticated user

### Mutations

- `addBook` - Add a new book
- `deleteBook` - Remove a book
- `addAuthor` - Add a new author
- `editAuthor` - Update author's birth year
- `createUser` - Register new user
- `login` - Authenticate user

### Subscriptions

- `bookAdded` - Real-time notification when a book is added

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend Setup

```bash
cd library-backend
npm install
```

Create `.env` file:

```
MONGODB_URI=your_mongodb_connection_string
SECRET=your_jwt_secret
```

```bash
npm start
```

The GraphQL server runs on `http://localhost:4000`. Access the Apollo Sandbox at that URL to explore the API.

### Frontend Setup

```bash
cd library-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Built as part of

[Full Stack Open](https://fullstackopen.com/) - University of Helsinki (Part 8: GraphQL)
