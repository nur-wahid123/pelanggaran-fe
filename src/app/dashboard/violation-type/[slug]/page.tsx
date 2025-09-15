"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { useToast } from "@/hooks/use-toast";
import { ViolationType } from "@/objects/violation-type.object";
import { Violation } from "@/objects/violation.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import EditViolationType from "@/user-components/violation-type/update-violation-type.component";
import { formatDateToExactStringAndTime } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { Trash2, AlertTriangle, Users, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const violationTypeId = params.slug
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ViolationType>({} as ViolationType);
    const toaster = useToast();

    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION_TYPE}/${violationTypeId}`).then((res) => {
            setData(res.data.data);
        })
    }, [violationTypeId])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    function handleDelete(id: number) {
        setIsLoading(true);
        if (data.violations.length > 0) {
            toaster.toast({
                title: "Error",
                description: "Pelanggaran ini sudah dipakai, tidak bisa dihapus",
                variant: "destructive",
            })
            setIsLoading(false);
            return;
        }

        axiosInstance.delete(`${ENDPOINT.DELETE_VIOLATION_TYPE}/${id}`).then(() => {
            toaster.toast({
                title: "Success",
                description: "Pelanggaran berhasil dihapus",
                variant: "default",
            })
            router.push('/dashboard/violation-type');
        })
            .catch((err) => {
                setIsLoading(false);
                if (err.code === 400) {
                    toaster.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" });
                } else {
                    toaster.toast({ title: "Error", description: err.response.data.message, variant: "destructive" });
                }
            });
    }
    const { data: dataV, loading: loadingV, ref: refV } = useInfiniteScroll<Violation, HTMLDivElement>({ filter: { violation_type_id: violationTypeId, type: ViolationTypeEnum.COLLECTION }, take: 10, url: ENDPOINT.MASTER_VIOLATION });
    const totalStudents = data?.violations?.reduce((acc, curr) => acc + curr.students?.length, 0) || 0;
    const totalViolations = data?.violations?.length || 0;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        {data?.name || 'Tipe Pelanggaran'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Detail jenis pelanggaran dan riwayat pelanggaran
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <EditViolationType violationTypeId={data.id} reFetch={fetchData} />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isLoading}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus jenis pelanggaran ini? Tindakan ini tidak dapat dibatalkan.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogTrigger>
                                <Button 
                                    variant="destructive" 
                                    onClick={() => handleDelete(data.id ?? 0)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Menghapus..." : "Hapus"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Pelanggaran</p>
                                <p className="font-semibold break-words">{data?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-8 w-8 text-orange-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Poin</p>
                                <p className="font-semibold">{data?.point || 0} Poin</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Siswa Pelanggar</p>
                                <p className="font-semibold">{totalStudents} Siswa</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pelanggaran</p>
                                <p className="font-semibold">
                                    {totalViolations === 0 ? "Tidak Pernah" : `${totalViolations} Kali`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Violation History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Riwayat Pelanggaran ({dataV.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {dataV.map((v, i) => {
                            const isLastItem = dataV.length === i + 1;
                            return (
                                <Link key={i} href={`/dashboard/violation/${v.id}`}>
                                    <Card 
                                        ref={isLastItem ? refV : null}
                                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <Calendar className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {formatDateToExactStringAndTime(new Date(String(v.date)) ?? new Date())}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {v.students?.length || 0} Siswa
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground">Pencatat</p>
                                                    <p className="font-medium">{v.creator?.name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                        
                        {loadingV && (
                            <Card>
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                            <p className="text-muted-foreground">Memuat data...</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {dataV.length === 0 && !loadingV && (
                            <Card>
                                <CardContent className="p-8">
                                    <div className="text-center">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Tidak ada riwayat pelanggaran</h3>
                                        <p className="text-muted-foreground">
                                            Jenis pelanggaran ini belum pernah dilakukan oleh siswa
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}