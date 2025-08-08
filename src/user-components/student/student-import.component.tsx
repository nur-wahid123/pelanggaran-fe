import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, RefreshCcwDotIcon } from "lucide-react"
import ExcelJS, { CellValue } from "exceljs";
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Student } from "@/objects/student.object"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"

export class StudentCreateDto {
    public id?: number;

    public name?: string;

    public nis?: string;

    public nisn?: string;

    public class_name?: string

}

export default function ImportStudent({ reFetch }: { reFetch: () => void }) {
    const [fileData, setFileData] = useState<StudentCreateDto[]>([]);
    const [successData, setSuccessData] = useState<number[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);
    const [chunks, setChunks] = useState<StudentCreateDto[][]>([]);
    const toaster = useToast()
    const [success, setSuccess] = useState<number>(0);
    const [bool, setBool] = useState({ loading: false, dialog: false, isOneByOne: false });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!files) {
            return;
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onload = async (event) => {
            if (event.target) {
                const buffer = event.target?.result as ArrayBuffer;
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(buffer); // Load the buffer
                const worksheet = workbook.getWorksheet(1); // Get the first sheet
                if (worksheet) {
                    const rows: Student[] = [];
                    let rowKey: CellValue[] = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) {
                            const rowData = row.values;
                            rowKey = Object.values(rowData);
                            rowKey.unshift('oi');
                        }
                        if (rowNumber > 1) {
                            const student = new StudentCreateDto();
                            const rowData = row.values;
                            if (Array.isArray(rowData) && rowData.length > 0) {
                                student.name = rowData[rowKey.indexOf('Nama')] as string;
                                student.nisn = String(rowData[rowKey.indexOf('NISN')]) as string;
                                student.nis = String(rowData[rowKey.indexOf('NIS')]) as string;
                                student.class_name = rowData[rowKey.indexOf('Kelas')] as string;
                            }
                            rows.push(student);
                        }
                    });
                    setFileData(rows);
                }
            }
        };
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFiles(() => (event.target?.files));
    };

    const handleDownloadPdf = () => {
        const chunks = chunkArray(fileData, 200);
        setChunks(chunks);
    };

    function chunkArray(array: Student[], chunkSize: number) {
        const results = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            results.push(array.slice(i, i + chunkSize));
        }
        return results;
    }

    async function sendData(data: Student[], index: number) {
        const failedData: string[] = [];
        try {
            setBool({ ...bool, loading: true });
            const res = await axiosInstance.post(`${ENDPOINT.STUDENT_CREATE_BATCH}`, { items: data });
            if (res.data.code === 400) {
                throw res.data;
            }
            toaster.toast({
                title: `Berhasil batch ${index}`,
                description: `Berhasil memasukkan ${data.length} siswa`
            })
            setSuccessData([...successData, index]);
            if (failedData.length > 0) {
                toaster.toast({
                    title: `Gagal batch ${index}`,
                    description: `Gagal Memasukkan Siswa`,
                    variant: 'destructive'
                })
            }
            setBool({ ...bool, loading: false });
            reFetch();
            setSuccess(e => e + 1);
        } catch (error) {
            let errMsg = error as any;
            errMsg = errMsg.status === 400 ? errMsg.response.data.message[0] : errMsg.response.data.message;
            toaster.toast({
                title: "Gagal Memasukkan Siswa",
                variant: "destructive",
                description: `Gagal dimasukkan database, alasan ${errMsg}`
            })
            setBool({ ...bool, loading: false });
        }
        setBool({ ...bool, loading: false })
    }

    return (
        <Dialog open={bool.dialog} onOpenChange={(a) => setBool({ ...bool, dialog: a })}>
            <DialogTrigger asChild>
                <Button>
                    <Plus></Plus> Import Siswa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Siswa</DialogTitle>
                    <DialogDescription asChild>
                        <div style={{ height: "60vh" }} className="flex flex-col overflow-auto gap-3">
                            <form
                                className=" max-w-xl flex flex-col gap-3"
                                onSubmit={handleSubmit}
                                method="post"
                            >
                                <Label className="label">
                                    Masukkan Daftar Peserta Didik
                                </Label>
                                <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    className="file-input file-input-bordered"
                                    id="file"
                                    onChange={(e) => handleFileChange(e)}
                                />
                                <Button type="submit">
                                    Baca file Excell
                                </Button>
                            </form>
                            <p>Berhasil membaca {fileData.length} data siswa</p>
                            <div className="flex w-full">
                                <Button onClick={handleDownloadPdf}>
                                    Pisahkan data siswa
                                </Button>
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <Label>Berhasil Memasukkan {success} data</Label>
                                <Button onClick={() => {
                                    setSuccess(0);
                                    setSuccessData([]);
                                    setChunks([]);
                                    setBool({ ...bool, loading: false });
                                }}><RefreshCcwDotIcon/></Button>
                            </div>
                            <div className="flex w-full flex-wrap gap-3">
                                {chunks.map((chunk, index) => (
                                    <div key={index}>
                                        <Button disabled={bool.loading || successData.includes(index)} className="btn"
                                            onClick={() => sendData(chunk, index)}>
                                            Masukkan data ke-{index + 1}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}