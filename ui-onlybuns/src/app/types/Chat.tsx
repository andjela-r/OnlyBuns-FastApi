import { RegisteredUser } from "./Post";

export interface Chat { 
  id: number; 
  name?: string | null; 
  is_group: boolean; 
  created_by: number; 
  created_at: string; 
  members?: RegisteredUser[];
};

export interface Message {
    id: number; 
    chat_id: number; 
    sender_id: number; 
    sender_username?: string; 
    content: string; 
    created_at: string; 
};

