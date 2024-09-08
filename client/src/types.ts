export type Customer = {
    name: string
    email: string
    id: string
    phone: string
}

export type File = {
    f_name: string
    f_id: string
    f_path: string
    f_status: "pending" | "uploaded" | "uploading"
    customers: Customer[]
    user: User
}

export type User = {
    u_name: string
    u_id: string
}