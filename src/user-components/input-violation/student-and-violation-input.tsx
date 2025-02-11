import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { axiosInstance } from "@/util/request.util";
import { PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Summary from "./summary.component";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function StudentAndViolationInput() {
    const [studentIds, setStudentIds] = useState<Student[]>([]);
    const [violationIds, setViolationIds] = useState<ViolationType[]>([]);
    const [dataStudents, setDataStudents] = useState<Student[]>([]);
    const [dataViolations, setDataViolations] = useState<ViolationType[]>([]);
    const [search, setSearch] = useState<{ student: string, violation: string }>({ student: '', violation: '' });
    const [note, setNote] = useState<string>('');
    const toaster = useToast()

    const fetchAll = useCallback(async () => {
        fetchStudent();
        fetchViolations();
    }, [])

    const handleSubmit = async () => {

        const stdIds = studentIds.map((s) => s.id)
        const vltIds = violationIds.map((v) => v.id)
        if (stdIds.length === 0 || vltIds.length === 0) {
            toaster.toast({ description: 'Data Harus Lengkap', title: 'Gagal', variant: 'destructive' })
            return;
        }
        const isYes = confirm('Apa anda yakin data sudah benar?')
        if (!isYes) return;
        const body = {
            student_ids: stdIds,
            violation_type_ids: vltIds,
            note
        }
        try {
            const res = await axiosInstance.post(ENDPOINT.CREATE_VIOLATION, body)
            toaster.toast({ description: 'Berhasil Menambahkan Data', title: 'Sukses' })
            setStudentIds([])
            setViolationIds([])
            setNote('')
            setSearch({ ...search, student: '', violation: '' })
        } catch (error) {
            toaster.toast({ description: 'Data Gagal Di Input', title: 'Gagal', variant: 'destructive' })
        }

    }

    const fetchStudent = useCallback(async (search?: string) => {

        const params: Record<string, any> = {
            page: 1,
            take: 20,
        };

        if (search) {
            params.search = search;
        }

        const res = await axiosInstance.get(`${ENDPOINT.MASTER_STUDENT}`, {
            params,
        });

        if (Array.isArray(res.data.data)) {
            setDataStudents(res.data.data);
        }
    }, [])

    const fetchViolations = useCallback(async (search?: string) => {
        const paramsViolation: Record<string, any> = {
            page: 1,
            take: 20,
        };

        if (search) {
            paramsViolation.search = search;
        }

        const resViolation = await axiosInstance.get(`${ENDPOINT.MASTER_VIOLATION_TYPE}`, {
            params: paramsViolation,
        });

        if (Array.isArray(resViolation.data.data)) {
            setDataViolations(resViolation.data.data);
        }
    }, [])

    useEffect(() => {
        fetchAll()
    }, [])

    useEffect(() => {
        fetchStudent(search.student)
    }, [search.student])

    useEffect(() => {
        fetchViolations(search.violation)
    }, [search.violation])
    function setVlt(violation: ViolationType) {
        setViolationIds(violationIds.filter(v => v.id !== violation.id))
    }
    function setStd(student: Student) {
        setStudentIds(studentIds.filter(s => s.id !== student.id));
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="w-full flex gap-3 ">
                <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-3">
                        <Input
                            type='text'
                            placeholder="Cari Nama Siswa"
                            className="w-full"
                            onChange={(e) => setSearch({ ...search, student: e.target.value })}
                        />
                        <Button onClick={() => { setStudentIds([]) }}><RefreshCwIcon /></Button>
                    </div>
                    <div className="w-full h-96 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Nama Siswa
                                    </TableHead>
                                    <TableHead>
                                        NIS
                                    </TableHead>
                                    <TableHead>
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataStudents.map((student, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="text-lg font-semibold">
                                                {student.name}
                                            </div>
                                            <p>{student.national_student_id}</p>
                                        </TableCell>
                                        <TableCell>
                                            {student.school_student_id}
                                        </TableCell>
                                        <TableCell>
                                            <Button size={'sm'} disabled={studentIds.map(s => s.id).includes(student.id)} onClick={() => {
                                                setStudentIds([...studentIds, student])
                                            }} className="btn btn-primary">Tambahkan Siswa <PlusCircleIcon /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-3">
                        <Input
                            type='text'
                            size={2}
                            placeholder="Cari Pelanggaran"
                            className="w-full"
                            onChange={(e) => setSearch({ ...search, violation: e.target.value })}
                        />
                        <Button onClick={() => { setViolationIds([]) }}><RefreshCwIcon /></Button>
                    </div>
                    <div className="w-full h-96 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Nama Pelanggaran
                                    </TableHead>
                                    <TableHead>
                                        Poin
                                    </TableHead>
                                    <TableHead>
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataViolations.map((violation, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div>
                                                {violation.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {violation.point}
                                        </TableCell>
                                        <TableCell>
                                            <Button size={"sm"} disabled={violationIds.map(v => v.id).includes(violation.id)} onClick={() => {
                                                setViolationIds([...violationIds, violation])
                                            }} className="btn btn-primary">Tambahkan Pelanggaran <PlusCircleIcon /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow w-full min-h-screen">
                <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                    Detail Pelanggaran
                </h1>
                <Summary students={studentIds} violations={violationIds} setStudentIds={setStd} setViolationIds={setVlt} />
            </div>
            <Label className="text-2xl">Catatan</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="flex w-full">
                <Button onClick={handleSubmit} className="w-full h-56">Tambahkan Pelanggaran</Button>
            </div>
        </div>
    );
}