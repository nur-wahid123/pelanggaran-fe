import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRef } from "react";

export default function UploadViolationImages({ files, setFiles }: { files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>> }) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef2 = useRef<HTMLInputElement>(null)
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-rows-2 md:grid-rows-1 gap-3">
                <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Pilih Gambar Dari File
                </Button>
                <Button
                    type="button"
                    onClick={() => fileInputRef2.current?.click()}
                    className="md:hidden"
                >
                    Buka Kamera
                </Button>
            </div>
            <input
                ref={fileInputRef}
                accept="image/*"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    if (!e.target.files) return
                    const newFiles = Array.from(e.target.files)
                    setFiles((prev) => [...prev, ...newFiles])
                    e.target.value = ""
                }}
            />
            <input
                ref={fileInputRef2}
                accept="image/*"
                type="file"
                multiple
                capture="environment"
                className="hidden"
                onChange={(e) => {
                    if (!e.target.files) return
                    const newFiles = Array.from(e.target.files)
                    setFiles((prev) => [...prev, ...newFiles])
                    e.target.value = ""
                }}
            />
            {files.length > 0 &&
                <div className="border flex flex-wrap gap-4 border-slate-300 p-4 rounded-sm">
                    {files.map((file) => (
                        <div key={file.name} className="w-1/4 p-2 flex flex-col justify-center border border-slate-300 rounded hover:scale-[99%]">
                            <img className="w-full h-auto" src={URL.createObjectURL(file)} alt={file.name} />
                            <p className="text-center text-sm ">
                                {file.name.length > 20 ? (
                                    <>{file.name.slice(0, 8)}...{file.name.split('.').pop()}</>
                                ) : (
                                    file.name
                                )}
                            </p>
                            <Button type="button" onClick={() => setFiles(files.filter((f) => f.name !== file.name))}><Trash /></Button>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}