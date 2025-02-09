import { ClassObject } from "./class.object";
import { Violation } from "./violation.object";

export interface Student {
    id?: number;
  
    name?: string;
  
    school_student_id?: string;
  
    national_student_id?: string;
  
    violations?: Violation[];
  
    student_class?: ClassObject;
}