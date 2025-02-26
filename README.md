# Go-Blog
Project 1 from https://roadmap.sh/backend/project-ideas to review Go and self-teach myself MongoDB

# Goals
- Demonstrate experience with Golang and deepen understanding of language
- Learn how to use MongoDB for the first time
- Demonstrate experience with Docker
- Demonstrate ability to build APIs for CRUD operations

# Running the project locally

## Backend:

Make sure you create an `.env` file in your `backend` directory. Variables the `compose.yml` file will be looking for are:
- DB_PORT
- DATABASE
- APP_PORT
- MONGO_URI

To run:
- Run `docker compose up --build` in `backend` directory

To stop containers:
- Run `docker compose down`

## Frontend:

To run:
- Run `npm run dev` after installing all dependencies
