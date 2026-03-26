#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const command = process.argv.slice(2);

type Statuses = 'done' | 'todo' | 'in-progress';

/**
 * These values that will be stored inside the json file.
 */
interface Task {
    id: number;
    status: Statuses;
    description: string;
    createdAt: string;
    updatedAt: string;
};

const FILE_PATH = path.join(process.cwd(), "tasks.json");


/**
 * Executes a function and returns its result.
 * if the function throws, logs the error and returns the fallback value instead.
 * 
 * @param fn - The function to execute
 * @param fallback - The value to return if `fn` throws
 * @returns - The result of `fn`, or `fallback` on error.
 */
function tryCatch<T>(fn: () => T, fallback: T): T {
    try {
        return fn();
    } catch (error) {
        console.error("Operation Failed: ", error);
        return fallback;
    }
}

/**
 * Read values from json file and returns the values.
 * 
 * @returns - The Task from the json file.
 */
function loadTasks(): Task[] {
    if (!fs.existsSync(FILE_PATH))
        fs.writeFileSync(FILE_PATH, "[]", "utf-8");

    return tryCatch(() => {
        const raw = fs.readFileSync(FILE_PATH, "utf-8");
        return JSON.parse(raw) as Task[];
    }, []);
}

/**
 * Write Values inside json file 
 * 
 * @param tasks - The Tasks we are going to write inside the json file
 */
function saveTasks(tasks: Task[]): void {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}


/**
 * 
 * @param tasks - The Tasks we are going to write inside the json file
 * @returns - It returns next unique id, The old/deleted ids are not reused
 */
function getNextId(tasks: Task[]): number {
    return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
}

function currentTime(): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
    const date = now.getFullYear();

    return `${day}-${month}-${date}`;
}

/**
 * 
 * @param description - Description of the tasks
 */
function addTasks(description: string): void {
    const tasks = loadTasks();
    const task: Task = {
        id: getNextId(tasks),
        description,
        status: "todo",
        createdAt: currentTime(),
        updatedAt: currentTime(),
    };
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${task.id})`);
}


/**
 * 
 * @param filter - This string contains the all the status message including undefined
 */
function listTasks(filter?: string): void {
    const tasks = loadTasks();
    const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;

    if (filtered.length === 0) return console.log("No tasks found.");

    filtered.forEach((t) => {
        console.log(`[${t.id}] (${t.status}) ${t.description}`);
    });
}

/**
 * 
 * @param id - Delete item with this id
 */
function deleteTasks(id: number): void {
    const tasks = loadTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) return console.log(`Task with ID ${id} not found`);
    tasks.splice(index, 1);
    saveTasks(tasks);

    console.log(`Tasks ${id} deleted successfully.`);
}

/**
 * 
 * @param id - Update Item with this id
 * @param description - This is the updated description 
 */
function updateTasks(id: number, description: string): void {

    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) return console.log(`Task with ID ${id} not found.`);

    task.description = description;
    task.updatedAt = currentTime();

    saveTasks(tasks);

    console.log(`Task ${id} updated successfully.`);
}

/**
 * 
 * @param id - Update Status with this id
 * @param status - This is changed status
 */
function markTask(id: number, status: Statuses): void {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) return console.log(`Task with ID ${id} not found`);

    task.status = status;
    task.updatedAt = currentTime();

    saveTasks(tasks);

    console.log(`Task ${id} marked as ${status}.`);
}

/**
 * , , - skips node + script path
 * action = add | delete | update | list | mark-in-progress | mark-in-done
 */
const [, , action, arg1, arg2] = process.argv;


switch (action) {
    case "add":
        if (!arg1) { console.log("Usage: task-cli add <description>"); break; }
        addTasks(arg1);
        break;

    case "delete":
        if (!arg1) { console.log("Usage: task-cli delete <id>"); break; }
        deleteTasks(Number(arg1));
        break;

    case "update":
        if (!arg1 || !arg2) { console.log("Usage: task-cli update <id> <description>"); break; }
        updateTasks(Number(arg1), arg2);
        break;

    case "mark-in-progress":
        if (!arg1) { console.log("Usage: task-cli mark-in-progress <id>"); break; }
        markTask(Number(arg1), "in-progress");
        break;

    case "mark-done":
        if (!arg1) { console.log("Usage: task-cli mark-done <id>"); break; }
        markTask(Number(arg1), "done");
        break;

    case "list":
        listTasks(arg1);
        break;

    default:
        break;
}
