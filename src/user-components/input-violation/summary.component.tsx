import React from "react";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface SummaryProps {
    students: Student[];
    violations: ViolationType[];
    setStudentIds: (student: Student) => void;
    setViolationIds: (violation: ViolationType) => void;
}

const Summary: React.FC<SummaryProps> = ({ students, violations, setStudentIds, setViolationIds }) => {

    return (
        <div className="flex h-full flex-col md:flex-row max-h-72 w-full">
            <div className="w-full flex overflow-auto">
                <div className="w-full h-full max-h-72">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Siswa</TableHead>
                                <TableHead>NISN</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name?.toUpperCase()}</TableCell>
                                    <TableCell>{student.national_student_id}</TableCell>
                                    <TableCell>
                                        <Button size={'sm'} onClick={() => setStudentIds(student)}><TrashIcon /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="w-full flex overflow-auto">
                <div className="w-full h-full max-h-72">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelanggaran</TableHead>
                                <TableHead>Poin</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {violations.map(violation => (
                                <TableRow key={violation.id}>
                                    <TableCell>{violation.name}</TableCell>
                                    <TableCell>{violation.point}</TableCell>
                                    <TableCell>
                                        <Button size={'sm'} onClick={() => setViolationIds(violation)}><TrashIcon /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {violations.length !== 0 && (
                            <TableFooter>
                                <TableRow>
                                    <TableCell>
                                        Jumlah
                                    </TableCell>
                                    <TableCell>
                                        {violations.reduce((a, b) => a + (b.point ?? 0), 0)}
                                    </TableCell>
                                    <TableCell>
                                        Poin
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Summary;

