# What's For Dinner?

A responsive web app that helps you decide what to cook for dinner based on your skill level, taste/health preference, cuisine, and available time. Built with Vite + React + TypeScript (frontend) and Node.js + Express + TypeScript (backend).

---

## Project Structure

```
/WhatsForDinner
  /frontend
    .gitignore
    eslint.config.js
    index.html
    package.json
    README.md
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
    /public
    /src
      /assets
      App.css
      App.tsx
      index.css
      main.tsx
      vite-env.d.ts
  /backend
    .gitkeep (placeholder file)
```

---

## Getting Started (For Teammates)

### 1. Clone the Repository

Open your terminal and run:

```sh
git clone <repo-url>
cd WhatsForDinner
```

Replace `<repo-url>` with the HTTPS or SSH URL from GitHub.

### 2. Create a New Branch

Always create a new branch for your work (feature, bugfix, etc.):

```sh
git checkout -b your-branch-name
```

Example:

```sh
git checkout -b feature/recipe-screen
```

### 3. Make Your Changes

Work in the appropriate folder (`frontend` or `backend`).

### 4. Add and Commit Your Changes

```sh
git add .
git commit -m "Describe your changes here"
```

### 5. Push Your Branch to GitHub

```sh
git push --set-upstream origin your-branch-name
```

### 6. Create a Pull Request (PR)

1. Go to the repository on GitHub.
2. You will see a prompt to create a pull request for your branch. Click it, or go to the "Pull requests" tab and click "New pull request".
3. Select your branch as the source and `main` as the target.
4. Add a clear title and description.
5. Submit the pull request.
6. Wait for a teammate to review and approve, or (if you are an admin and alone) use the bypass option.

---

## Branch Protection

- Direct pushes to `main` are blocked. All changes must go through pull requests.
- At least one approval is required (unless bypassed by an admin).

---

## Project Setup

### Frontend

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Backend

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. (Setup instructions will be added after backend initialization)

---

## Contribution Guidelines

- Always work on a separate branch.
- Write clear commit messages.
- Open a pull request for review.
- Communicate with your team about what you are working on.

---

## Contact

For questions, contact the repository admin or open an issue on GitHub.
