export interface IReturn {
    status: "success" | "error";
    message: string;
    data: any;
}