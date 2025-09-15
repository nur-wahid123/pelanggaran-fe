'use client'
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { Student } from "@/objects/student.object";
import { Violation } from "@/objects/violation.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { Users, Hash, GraduationCap, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Page() {
    const param = useParams()
    const studentId = useMemo<string>(() => {
        return String(param.slug)
    }, [param])
    const [student, setStudent] = useState<Student | undefined>(undefined);
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_STUDENT}/${studentId}`).then((res) => {
            setStudent(res.data.data)
        })
    }, [studentId])
    useEffect(() => {
        fetchData();
    }, [])
    const { data: dataV, loading: loadingV, ref: refV } = useInfiniteScroll<Violation, HTMLDivElement>({ filter: { student_id: studentId, type: ViolationTypeEnum.COLLECTION }, take: 10, url: ENDPOINT.MASTER_VIOLATION });
    
    const totalPoints = dataV.length === 0 ? 0 : dataV?.reduce((acc, curr) => acc + curr.violation_types?.reduce((acc, curr) => acc + curr.point, 0), 0);
    const totalViolations = dataV.length;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                        {student?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{student?.name || 'Detail Siswa'}</h1>
                    <p className="text-muted-foreground">Informasi lengkap siswa dan riwayat pelanggaran</p>
                </div>
            </div>

            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Nama</p>
                                <p className="font-semibold">{student?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Kelas</p>
                                <p className="font-semibold">{student?.student_class?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Hash className="h-8 w-8 text-purple-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">NISN</p>
                                <p className="font-semibold">{student?.national_student_id || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Hash className="h-8 w-8 text-orange-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">NIS</p>
                                <p className="font-semibold">{student?.school_student_id || 'N/A'}</p>
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
                                <p className="font-semibold">{totalPoints} Poin</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pelanggaran</p>
                                <p className="font-semibold">{totalViolations} Kali</p>
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
                            const violationPoints = v.violation_types?.reduce((acc, curr) => acc + curr.point, 0) || 0;
                            
                            return (
                                <Link key={i} href={`/dashboard/violation/${v.id}`}>
                                    <Card 
                                        ref={isLastItem ? refV : null}
                                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center">
                                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {formatDateToExactString(new Date(String(v.date)) ?? new Date())}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatDateToExactTime(new Date(String(v.date)) ?? new Date())}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="destructive" className="mb-1">
                                                        {violationPoints} Poin
                                                    </Badge>
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
                                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Tidak ada riwayat pelanggaran</h3>
                                        <p className="text-muted-foreground">
                                            Siswa ini belum pernah melakukan pelanggaran
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