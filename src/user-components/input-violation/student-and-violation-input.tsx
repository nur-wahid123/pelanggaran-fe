import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { axiosInstance } from "@/util/request.util";
import { PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { useCallback, useState } from "react";
import Summary from "./summary.component";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { truncateName } from "@/util/util";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import SearchBar from "../ui/search-bar";

export default function StudentAndViolationInput() {
    const [studentIds, setStudentIds] = useState<Student[]>([]);
    const [violationIds, setViolationIds] = useState<ViolationType[]>([]);
    const [search, setSearch] = useState<{ student: string, violation: string }>({ student: '', violation: '' });
    const [note, setNote] = useState<string>('');
    const toaster = useToast()
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const { data: dataStudents, loading: loadingStudent, ref:refS } = useInfiniteScroll<Student,HTMLTableRowElement>({ filter: { search: search.student }, take: 20, url: ENDPOINT.MASTER_STUDENT })
    const { data: dataViolations, loading: loadingViolationTypes, ref:refV } = useInfiniteScroll<ViolationType,HTMLTableRowElement>({ filter: { search: search.violation }, take: 20, url: ENDPOINT.MASTER_VIOLATION_TYPE })
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
        } catch (e) {
            console.log(e);
            toaster.toast({ description: 'Data Gagal Di Input', title: 'Gagal', variant: 'destructive' })
            setDialogVisibility(false)
        }

    }
    function setVlt(violation: ViolationType) {
        setViolationIds(violationIds.filter(v => v.id !== violation.id))
    }
    function setStd(student: Student) {
        setStudentIds(studentIds.filter(s => s.id !== student.id));
    }

    const handleSearch = useCallback((query: string) => {
        if (query !== search.student) {
            setSearch({ ...search, student: query });
        }
    }, [search]);

    const handleSearchVi = useCallback((query: string) => {
        if (query !== search.violation) {
            setSearch({ ...search, violation: query });
        }
    }, [search]);
    return (
        <div className="flex flex-col gap-4">
            <div className="w-full grid grid-cols-2 gap-3 ">
                <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-3">
                        <SearchBar onSearch={handleSearch} />
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
                                {dataStudents.map((student, i) => {
                                    if (dataStudents.length === i + 1) {
                                        return (
                                            <TableRow ref={refS} key={i}>
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
                                        )
                                    } else {
                                        return (
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
                                        )
                                    }
                                })}
                                {loadingStudent && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                                {!loadingStudent && dataStudents.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">{search.student === '' ? 'Data Kosong' : 'Data Tidak Ditemukan'}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex gap-3">
                        <SearchBar onSearch={handleSearchVi} />
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
                                {dataViolations.map((violation, i) => {
                                    if (dataViolations.length === i + 1) {
                                        return (
                                            <TableRow ref={refV} key={i}>
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
                                        )
                                    } else {
                                        return (
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
                                        )
                                    }
                                })}
                                {loadingViolationTypes && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                                {!loadingViolationTypes && dataViolations.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">{search.violation === '' ? 'Data Kosong' : 'Data Tidak Ditemukan'}</TableCell></TableRow>}
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
                                                            {truncateName(student.name?.toUpperCase() ?? '', 30)} - <span className="text-slate-400">{student.national_student_id}</span>
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