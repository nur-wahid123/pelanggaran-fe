'use client'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import ENDPOINT from "@/config/url"
import { Violation } from "@/objects/violation.object"
import { PreviewImage } from "@/user-components/preview-image.component"
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util"
import { axiosInstance } from "@/util/request.util"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Trash2, Calendar, Clock, User, Users, AlertTriangle, TrendingUp, FileText, Image } from "lucide-react"

export default function Page() {
    const param = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const violationId = useMemo(() => { return String(param.slug) }, [param])
    const [violation, setViolation] = useState<Violation | undefined>(undefined)
    const [images, setImages] = useState<number[]>([]);
    const [isDeleting, setIsDeleting] = useState(false)
    const fetchImage = useCallback(async (violation: Violation) => {
        await axiosInstance.get(`${ENDPOINT.LIST_IMAGE}/${violation.image?.id}`).then((res) => {
            setImages(res.data.data)
        })
    }, [violation])
    
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION}/${violationId}`).then((res) => {
            setViolation(res.data.data)
            if (!res.data.data.image) {
                return
            }
            fetchImage(res.data.data)
        })
    }, [violation, fetchImage])

    useEffect(() => {
        fetchData();
    }, [])

    const handleDeleteViolation = useCallback(async () => {
        if (!violation) return;
        
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`${ENDPOINT.DELETE_VIOLATION}/${violationId}`);
            toast({
                title: "Berhasil",
                description: "Pelanggaran berhasil dihapus",
            });
            router.push('/dashboard/violation');
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Gagal menghapus pelanggaran",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    }, [violation, violationId, router, toast])

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
                    Detail Pelanggaran
                </h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus Pelanggaran
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus pelanggaran ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogTrigger>
                            <Button 
                                variant="destructive" 
                                onClick={handleDeleteViolation}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal</p>
                                <p className="font-semibold">{formatDateToExactString(violation?.date ? new Date(violation?.date) : new Date())}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Waktu</p>
                                <p className="font-semibold">{formatDateToExactTime(violation?.date ? new Date(violation?.date) : new Date())}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <User className="h-8 w-8 text-purple-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Pencatat</p>
                                <p className="font-semibold">{violation?.creator ? violation?.creator?.name : "-"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-orange-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Siswa</p>
                                <p className="font-semibold">{violation?.students.length || 0} Siswa</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Jenis Pelanggaran</p>
                                <p className="font-semibold">{violation?.violation_types.length || 0} Jenis</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Poin</p>
                                <p className="font-semibold">{violation?.violation_types.reduce((acc, curr) => acc + curr.point, 0) || 0} Poin</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Note Section */}
            {violation?.note && (
                <>
                    <Separator className="my-6"/>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Catatan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg break-words">
                                {violation.note}
                            </p>
                        </CardContent>
                    </Card>
                </>
            )}
            
            <Separator className="my-6"/>
            
            {/* Students Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Siswa ({violation?.students.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {violation?.students.map((st) => (
                            <Link href={`/dashboard/student/${st.national_student_id}`} key={st.id}>
                                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">
                                                    {st.name?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate" title={st.name}>{st.name}</p>
                                                <p className="text-sm text-muted-foreground">{st.national_student_id}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Separator className="my-6"/>
            
            {/* Violations Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Pelanggaran ({violation?.violation_types.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {violation?.violation_types.map((vt) => (
                            <Link href={`/dashboard/violation-type/${vt.id}`} key={vt.id}>
                                <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center">
                                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium break-words leading-tight" title={vt.name}>{vt.name}</p>
                                                    <p className="text-sm text-muted-foreground">Jenis Pelanggaran</p>
                                                </div>
                                            </div>
                                            <Badge variant="destructive">{vt.point} Poin</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/* Images Section */}
            {violation?.image && images.length > 0 && (
                <>
                    <Separator className="my-6"/>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Image className="h-5 w-5" />
                                Gambar ({images.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map((img) => (
                                    <div key={img} className="relative group">
                                        <PreviewImage 
                                            src={`${ENDPOINT.DETAIL_IMAGE}/${img}`} 
                                            alt="Violation evidence" 
                                            className="rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}