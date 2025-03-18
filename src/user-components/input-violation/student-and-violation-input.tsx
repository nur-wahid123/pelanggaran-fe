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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { truncateName } from "@/util/util";

export default function StudentAndViolationInput() {
    const [studentIds, setStudentIds] = useState<Student[]>([]);
    const [violationIds, setViolationIds] = useState<ViolationType[]>([]);
    const [dataStudents, setDataStudents] = useState<Student[]>([]);
    const [dataViolations, setDataViolations] = useState<ViolationType[]>([]);
    const [search, setSearch] = useState<{ student: string, violation: string }>({ student: '', violation: '' });
    const [note, setNote] = useState<string>('');
    const toaster = useToast()
    const [dialogVisibility, setDialogVisibility] = useState(false);

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
        const body = {
            student_ids: stdIds,
            violation_type_ids: vltIds,
            note
        }
        try {
            await axiosInstance.post(ENDPOINT.CREATE_VIOLATION, body)
            toaster.toast({ description: 'Berhasil Menambahkan Data', title: 'Sukses' })
            setStudentIds([])
            setViolationIds([])
            setNote('')
            setSearch({ ...search, student: '', violation: '' })
            setDialogVisibility(false)
        } catch (error) {
            toaster.toast({ description: 'Data Gagal Di Input', title: 'Gagal', variant: 'destructive' })
            setDialogVisibility(false)
        }

    }

    const fetchStudent = useCallback(async () => {

        const params: Record<string, any> = {
            page: 1,
            take: 20,
        };

        if (search) {
            params.search = search.student;
        }

        const res = await axiosInstance.get(`${ENDPOINT.MASTER_STUDENT}`, {
            params,
        });

        if (Array.isArray(res.data.data)) {
            setDataStudents(res.data.data);
        }
    }, [search])

    const fetchViolations = useCallback(async () => {
        const paramsViolation: Record<string, any> = {
            page: 1,
            take: 20,
        };

        if (search) {
            paramsViolation.search = search.violation;
        }

        const resViolation = await axiosInstance.get(`${ENDPOINT.MASTER_VIOLATION_TYPE}`, {
            params: paramsViolation,
        });

        if (Array.isArray(resViolation.data.data)) {
            setDataViolations(resViolation.data.data);
        }
    }, [search])

    useEffect(() => {
        fetchAll()
    }, [])

    useEffect(() => {
        fetchStudent()
    }, [search.student])

    useEffect(() => {
        fetchViolations()
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
                    </div>
                    <div className="w-full h-full max-h-96 overflow-auto">
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
                                                {student.name?.toUpperCase()}
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
                    </div>
                    <div className="w-full h-full max-h-96 overflow-auto">
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
            <div className="flex flex-col min-h-56 flex-grow w-full">
                <div className="flex gap-6 items-center">
                    <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                        Detail Pelanggaran
                    </h1>
                    <Button onClick={() => { setStudentIds([]); setViolationIds([]); }}><RefreshCwIcon /></Button>
                </div>
                <Summary students={studentIds} violations={violationIds} setStudentIds={setStd} setViolationIds={setVlt} />
            </div>
            <div className="flex w-full">
                <Button onClick={() => {
                    const stdIds = studentIds.map((s) => s.id)
                    const vltIds = violationIds.map((v) => v.id)
                    if (stdIds.length === 0 || vltIds.length === 0) {
                        toaster.toast({ description: 'Data Harus Lengkap', title: 'Gagal', variant: 'destructive' })
                        return;
                    }
                    setDialogVisibility(true)
                }
                } className="w-full">Tambahkan Pelanggaran</Button>
                <Dialog open={dialogVisibility} onOpenChange={setDialogVisibility}>
                    <DialogContent className="max-w-3xl text-black">
                        <DialogHeader>
                            <DialogTitle>Apa Anda yakin data sudah benar</DialogTitle>
                            <DialogDescription asChild>
                                <div className="p-2 w-full flex flex-col gap-4">
                                    <div className="grid grid-cols-2 text-black gap-8">
                                        <div>
                                            <div className="font-semibold text-center">Nama Siswa</div>
                                            <div className="flex max-h-60 overflow-y-auto w-full flex-col gap-2">
                                                {studentIds.map((student, i) => (
                                                    <div key={i} className="flex">
                                                        <div className="w-full whitespace-nowrap">
                                                            {truncateName(student.name?.toUpperCase() ?? '',30)} - <span className="text-slate-400">{student.national_student_id}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            {/* <div className="font-semibold text-center">Nama Pelanggaran</div> */}
                                            <div className="flex flex-col gap-2">
                                                <div className="grid font-semibold grid-cols-4">
                                                    <div className="col-span-3">
                                                        Nama Pelanggaran
                                                    </div>
                                                    <div className="w-full flex justify-center">
                                                        Poin
                                                    </div>
                                                </div>
                                                <div className="flex max-h-52 overflow-y-auto flex-col gap-2">
                                                    {violationIds.map((violation, i) => (
                                                        <div key={i} className="grid grid-cols-4">
                                                            <div className="col-span-3 border-r-2 border-slate-400">
                                                                {violation.name}
                                                            </div>
                                                            <div className="w-full flex justify-center items-center font-light">
                                                                {violation.point} Poin
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="grid font-semibold grid-cols-4">
                                                    <div className="col-span-3">
                                                        Total
                                                    </div>
                                                    <div className="w-full flex justify-center">
                                                        {violationIds.reduce((acc, curr) => acc + curr.point, 0)} Poin
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-black">
                                        <div className="font-semibold">Catatan</div>
                                        <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <Button onClick={() => handleSubmit()}>Tambahkan</Button>
                                        <Button variant={'outline'} onClick={() => setDialogVisibility(false)}>Batal</Button>
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}