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
import { Download, Plus, RefreshCcwDotIcon } from "lucide-react"
import ExcelJS, { CellValue } from "exceljs";
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Student } from "@/objects/student.object"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"

export class ViolationTypeCreateDto {

    public name?: string;

    public point?: number;

}

export default function ImportViolationType({ reFetch }: { reFetch: () => void }) {
    const [fileData, setFileData] = useState<ViolationTypeCreateDto[]>([]);
    const [successData, setSuccessData] = useState<number[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);
    const [chunks, setChunks] = useState<ViolationTypeCreateDto[][]>([]);
    const toaster = useToast()
    const [success, setSuccess] = useState<number>(0);
    const [bool, setBool] = useState({ loading: false, dialog: false, isOneByOne: false });

    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
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
                            const student = new ViolationTypeCreateDto();
                            const rowData = row.values;
                            if (Array.isArray(rowData) && rowData.length > 0) {
                                student.name = rowData[rowKey.indexOf('Nama')] as string;
                                student.point = Number(rowData[rowKey.indexOf('Poin')]) as number;
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
        handleSubmit();
        handleDownloadPdf();
        async function heee() {
        }
        heee();
    };

    const handleDownloadPdf = () => {
        const chunks = chunkArray(fileData, 200);
        setChunks(chunks);
    };

    async function handleDownload() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Jenis Pelanggaran');
        const columns = [
            { header: 'Nama', width: 40 },
            { header: 'Poin', width: 8 },
        ];

        worksheet.columns = columns;

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.protection = { locked: true }; // Lock the header cells
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Template Jenis Pelanggaran.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }

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
            const res = await axiosInstance.post(`${ENDPOINT.CREATE_VIOLATION_TYPE_BATCH}`, { items: data });
            if (res.data.code === 400) {
                throw res.data;
            }
            toaster.toast({
                title: `Berhasil batch ${index}`,
                description: `Berhasil memasukkan ${data.length} Jenis Pelanggaran`
            })
            setSuccessData([...successData, index]);
            if (failedData.length > 0) {
                toaster.toast({
                    title: `Gagal batch ${index}`,
                    description: `Gagal Memasukkan Jenis Pelanggaran`,
                    variant: 'destructive'
                })
            }
            setBool({ ...bool, loading: false });
            reFetch();
            setSuccess(e => e + 1);
        } catch (error) {
            console.error(error);
            let errMsg = error as any;
            errMsg = errMsg.status === 400 ? errMsg.response.data.message[0] : errMsg.response.data.message;
            toaster.toast({
                title: "Gagal Memasukkan Pelanggaran",
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
                    <Plus></Plus> Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Siswa</DialogTitle>
                    <DialogDescription asChild>
                        <div style={{ height: "60vh" }} className="flex flex-col overflow-auto gap-3">

                            <Label className="label">
                                Masukkan Daftar Peserta Didik
                            </Label>
                            <Button onClick={handleDownload}>
                                Download Template <Download />
                            </Button>
                            <Input
                                type="file"
                                name="file"
                                accept=".xls,.xlsx"
                                className="file-input file-input-bordered"
                                id="file"
                                onChange={handleFileChange}
                            />
                            <p>Berhasil membaca {fileData.length} data siswa</p>
                            <Button type="submit" onClick={() => handleSubmit()}>
                                Baca file Excell
                            </Button>
                            <Button type="submit" onClick={() => handleDownloadPdf()}>
                                Pisahkan data
                            </Button>
                            <div className="flex w-full justify-between items-center">
                                <Label>Berhasil Memasukkan {success} data</Label>
                                <Button onClick={() => {
                                    setSuccess(0);
                                    setSuccessData([]);
                                    setChunks([]);
                                    setBool({ ...bool, loading: false });
                                }}><RefreshCcwDotIcon /></Button>
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