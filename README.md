# Task-Tracker-CLI

A lightweight command-line task tracker built with Node.js and TypeScript.  
Tasks are persisted locally in a `tasks.json` file — no database required.

---

## Features

- [ ] Add Tasks
- [ ] Update Tasks
- [ ] Delete tasks
- [ ] Mark tasks **in-progress**
- [ ] Mark tasks **done** 
- [ ] List all tasks or filtered by status

---

## Requirements

- [ ] Node.js
- [ ] Typescript

---

## Installation

```bash
git clone https://github.com/Sahil-Hossain-1429/Task-Tracker-CLI.git

cd Task-Tracker-CLI

npm install
```

---

## Build

```bash
# Compile TypeScript to JavaScript
1. npm run build

# Register the "task-cli" command globally on your machine
2. npm link
```

To uninstall the global command:
```bash
npm unlink -g task-tracker-cli
```

---

## Usage
```bash
# add command
task-cli add <description>

# update command
task-cli update <id> <description>

# delete command
task-cli delete <id>

# mark-in-progress
task-cli mark-in-progress <id>

# mark-in-done
task-cli mark-done <id>

# list all tasks
task-cli list

# List tasks by status (todo | in-progress | done)
task-cli list <status>
```

---

## Project Structure
```
task-tracker-cli/
├── dist/               # Compiled JavaScript output
│   └── index.js
├── src/                # TypeScript source files
│   └── index.ts
├── tasks.json          # Local task storage (auto-created on first run)
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

---

## License

This project is licensed under the [MIT License](LICENSE).

--- 

## Acknowledgements

This project is part of the [roadmap.sh](https://roadmap.sh/) project challenges. 

Project Page: https://roadmap.sh/projects/task-tracker

