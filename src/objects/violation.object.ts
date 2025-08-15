import { Student } from "./student.object";
import { User } from "./user.object";
import { ViolationType } from "./violation-type.object";

export interface Violation {
  id?: number;

  imageGroupId?: number;

  date?: Date;

  note?: string;

  creator: User;

  students: Student[];

  created_at?: Date;

  updated_at?: Date;

  violation_types: ViolationType[];
}
