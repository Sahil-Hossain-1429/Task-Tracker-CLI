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
    return new Date().toISOString();
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

const action: string | undefined = command[0];

function listTasks(filter ?: string): void {
    const tasks = loadTasks();
    const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;

    if(filtered.length === 0) return console.log("No tasks found.");

    filtered.forEach((t) => {
        console.log(`[${t.id}] (${t.status}) ${t.description}`);
    });
}


switch (action) {
    case "add":
        if (!command[1]) {
            throw new Error("Description is required");
        }
        addTasks(command[1]);
        break;
    
    case "list":
        listTasks(command[1]);
    
    default:
        break;
}
