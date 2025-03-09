import { Student } from "./student.object";
import { ViolationType } from "./violation-type.object";

export class DashboardResponseDto {
  total_student?: number;

  total_point?: number;

  total_violation?: number;

  student_with_most_violation?: Student;

  most_violation_type?: ViolationType;

  student_with_point_more_than_30?: Student[] = [];

  student_with_point_more_than_50?: Student[] = [];

  student_with_point_more_than_70?: Student[] = [];

  violation_percentage_from_last_week?: number;

  violation_percentage_from_last_month?: number;
}
