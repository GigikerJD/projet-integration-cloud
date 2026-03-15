
export interface User {
    id: string,
    email: string,
    firstname: string,
    lastname: string,
    role: string,
    birthdate: string
}

export interface Task {
    id: string,
    userID: string,
    description?: string,
    priority: string,
    status: string,
    dueDate: string,
    completedAt: string
}