import { Student } from "./student.object";
import { User } from "./user.object";
import { ViolationType } from "./violation-type.object";

export interface Violation {
    id?: number;
  
    date?: Date;
  
    note?: string;
  
    creator: User;
  
    students: Student[];
  
    violation_types: ViolationType[];
}