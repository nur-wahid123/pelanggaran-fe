import { Student } from "./student.object";

export interface ClassObject {
    id?: number;
  
    name?: string;
  
    students?: Student[];
}