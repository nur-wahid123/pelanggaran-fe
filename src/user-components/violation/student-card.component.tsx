import { Student } from "@/objects/student.object";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Hash, GraduationCap } from "lucide-react";

export default function StudentCard({ filter }: { filter: { search: string, start_date: string, finish_date: string, type: ViolationTypeEnum } }) {
    const { data, loading, ref } = useInfiniteScroll<Student, HTMLDivElement>({ filter, take: 20, url: ENDPOINT.MASTER_VIOLATION })
    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {data.map((student, i) => {
                const isLastItem = data.length === i + 1;
                const totalViolations = student.violations?.length || 0;
                const totalPoints = student.violations?.reduce((acc, curr) => 
                    acc + curr.violation_types?.reduce((acc, curr) => acc + curr.point, 0), 0
                ) || 0;
                
                return (
                    <Card 
                        key={i} 
                        ref={isLastItem ? ref : null}
                        className="hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                    >
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Header with Student Name */}
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary">
                                            {student.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{student.name || 'N/A'}</h3>
                                        <p className="text-sm text-muted-foreground">Siswa</p>
                                    </div>
                                    <Badge variant={totalPoints > 30 ? "destructive" : totalPoints > 15 ? "default" : "secondary"}>
                                        {totalPoints} Poin
                                    </Badge>
                                </div>

                                {/* Student Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">NISN</p>
                                            <p className="font-semibold">{student.national_student_id || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-green-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">NIS</p>
                                            <p className="font-semibold">{student.school_student_id || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Violation Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Pelanggaran</p>
                                            <p className="font-semibold">{totalViolations} Kali</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-purple-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <p className="font-semibold">
                                                {totalPoints > 30 ? 'Perhatian Tinggi' : 
                                                 totalPoints > 15 ? 'Perhatian Sedang' : 
                                                 totalPoints > 0 ? 'Perhatian Rendah' : 'Tidak ada pelanggaran'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
            
            {loading && (
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
            
            {data.length === 0 && !loading && (
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {filter.search === '' ? 'Tidak ada data siswa' : 'Data tidak ditemukan'}
                            </h3>
                            <p className="text-muted-foreground">
                                {filter.search === '' 
                                    ? 'Belum ada data siswa untuk ditampilkan' 
                                    : 'Coba ubah kata kunci pencarian atau filter tanggal'
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}