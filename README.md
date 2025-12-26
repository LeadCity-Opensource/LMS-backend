# LMS Backend (Express + JavaScript)

This repository contains the **backend API** for the Learning Management System (LMS).

It is built with **Node.js**, **Express**, and uses **pnpm** as the package manager.

This README explains:

* What you need installed
* How to run the server
* How the project is structured
* The basic conventions we follow

---

## Requirements

Before you start, make sure you have the following installed on your computer:

### 1. Node.js

We use Node.js to run the server.

* Install Node.js (LTS version recommended)
* After installing, confirm it is installed by running:

```bash
node -v
```

If you see a version number, Node.js is installed correctly.

---

### 2. pnpm (Package Manager)

This project uses **pnpm** instead of npm or yarn.

#### Check if pnpm is installed

```bash
pnpm -v
```

If you see a version number, pnpm is already installed.

#### Install pnpm (if not installed)

```bash
npm install -g pnpm
```

After installing, verify again:

```bash
pnpm -v
```

---

## Getting Started

### 1. Fork the Repository

Before cloning, **fork this repository** on GitHub.

* Click the **Fork** button at the top-right of this page
* This creates your own copy of the repository under your GitHub account

---

### 2. Clone *Your Fork*

After forking, clone **your forked repository**:

```bash
git clone https://github.com/<your-username>/lms-backend.git
cd lms-backend
```

> Do **not** clone the original repository directly unless you have write access.

---

### 2. Install Dependencies

Run this command in the project root:

```bash
pnpm install
```

This will install all required dependencies listed in `package.json`.

---

### 3. Set Up Environment Variables

Environment variables are required for the app to run properly.

#### Step 1: Create a `.env` file

Copy the example file:

```bash
cp .env.example .env
```

#### Step 2: Update values if needed

Example `.env` file:

```env
PORT=5000
```

---

## Running the Server

```bash
pnpm dev
```

This uses **nodemon**, which automatically restarts the server when files change.

---

Once the server is running, you would see `Server running on port 5000` in your terminal

---

## Project Structure

```text
lms-backend/
│
├── src/
│   ├── index.js          # Application entry point
│   └── config/
│       └── env.js        # Environment variable configuration
│
├── .env.example          # Example environment variables
├── package.json
├── README.md
└── pnpm-lock.yaml
```

---

## Entry Point

### `src/index.js`

This is the **main entry point** of the application.

Responsibilities:

* Create the Express app
* Register routes
* Start the HTTP server

## Environment Variables Convention

### `src/config/env.js`

All environment variables **must be defined and exported here**.

Do **not** access `process.env` directly in other files.

Example:

```js
import "dotenv/config";

export const env = {
  PORT: process.env.PORT,
};
```

### Why this matters

* Centralized configuration
* Easier debugging
* Clear overview of required env variables

---

## Adding New Environment Variables

1. Add it to `.env.example`
2. Add it to your local `.env`
3. Export it from `src/config/env.js`

Example:

```env
DATABASE_URL=db://...
```

```js
export const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};
```

## Coding Conventions

* Use **ES Modules** (`import` / `export`)
* One responsibility per file
* Keep configuration in `config/`
* Avoid accessing `process.env` directly
* Keep code readable and simple

---

## Questions or Issues

If something is unclear or broken:

* Ask in the team chat
* Or open an issue in the repository


