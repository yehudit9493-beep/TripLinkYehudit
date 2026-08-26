export interface Message {
    idMessage: number
    idForum: number
    userId: number
    userName: string
    title: string,
    content: string;
    date: Date;
    relatedLinks?: string[];
    replies?: Reply[];
    likes?: number;
}

export interface Reply {
    idMessage: number
    idForum: number
    userId: number;
    userName: string;
    content: string;
    date: Date;
    relatedLinks?:string [],
    replies?: Reply[]
}