"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ENDPOINT from "@/config/url";
import { Violation } from "@/objects/violation.object";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Calendar, Clock, User, AlertTriangle, Plus } from "lucide-react";

export default function Page() {
    const [data, setData] = useState<Violation>({} as Violation);
    const params = useParams();
    const violationId = params.slug
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION}/${violationId}`).then((res) => {
            setData(res.data.data);
        }).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message[0]);
                return;
            } else {
                alert(err.response.data.message)
                return;
            }
        })
    }, [violationId])

    useEffect(() => {
        fetchData();
    }, [violationId])
    const totalPoints = data.violation_types?.reduce((acc, curr) => acc + curr.point, 0) || 0;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight text-green-600 mb-2">
                    Berhasil Memasukkan Pelanggaran
                </h1>
                <p className="text-muted-foreground">
                    Data pelanggaran telah berhasil disimpan ke sistem
                </p>
            </div>

            {/* Summary Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Informasi Pelanggaran
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Tanggal:</span>
                            <span className="text-sm">{formatDateToExactString(data.date ? new Date(data.date) : new Date())}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Waktu:</span>
                            <span className="text-sm">{formatDateToExactTime(data.date ? new Date(data.date) : new Date())}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Total Poin:</span>
                            <Badge variant="destructive" className="ml-1">{totalPoints} Poin</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students and Violations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Students Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Siswa ({data.students?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {data.students && data.students.map((student, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {student.name?.charAt(0).toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-sm text-muted-foreground">{student.national_student_id}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Violations Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Pelanggaran ({data.violation_types?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {data.violation_types && data.violation_types.map((vT, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-destructive/10 rounded-full flex items-center justify-center">
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium break-words leading-tight" title={vT.name}>{vT.name}</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive">{vT.point} Poin</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Note Section */}
            {data.note && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Catatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                            {data.note}
                        </p>
                    </CardContent>
                </Card>
            )}

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard/input-violation" className="flex-1 sm:flex-none">
                    <Button className="w-full sm:w-auto" size="lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Input Pelanggaran Lagi
                    </Button>
                </Link>
                <Link href="/dashboard" className="flex-1 sm:flex-none">
                    <Button variant="outline" className="w-full sm:w-auto" size="lg">
                        Kembali ke Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}