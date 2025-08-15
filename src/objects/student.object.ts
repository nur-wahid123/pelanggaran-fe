import { ClassObject } from "./class.object";
import { Violation } from "./violation.object";

export class Student {
  public id?: number;

  public name?: string;

  public school_student_id?: string;

  public national_student_id?: string;

  public violations?: Violation[];

  public student_class?: ClassObject;
}
