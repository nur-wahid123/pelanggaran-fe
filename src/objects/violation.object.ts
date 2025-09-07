import { ImageLink } from "./image-link.object";
import { Student } from "./student.object";
import { User } from "./user.object";
import { ViolationType } from "./violation-type.object";

export interface Violation {
  id?: number;

  date?: Date;

  note?: string;

  creator: User;

  image: ImageLink | null;

  students: Student[];

  created_at?: Date;

  updated_at?: Date;

  violation_types: ViolationType[];
}
