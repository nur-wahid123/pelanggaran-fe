import { Violation } from "@/objects/violation.object";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, AlertTriangle, User, FileText, Image } from "lucide-react";

export default function ViolationCard({ filter }: { filter: { search: string, start_date: string, finish_date: string, type: ViolationTypeEnum } }) {
    const { data, loading, ref } = useInfiniteScroll<Violation, HTMLDivElement>({ filter, take: 20, url: ENDPOINT.MASTER_VIOLATION })
    const route = useRouter();
    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {data.map((violation, i) => {
                const totalPoints = violation.violation_types?.reduce((acc, curr) => acc + curr.point, 0) || 0;
                const isLastItem = data.length === i + 1;
                
                return (
                    <Card 
                        key={i} 
                        ref={isLastItem ? ref : null}
                        onClick={() => route.push(`/dashboard/violation/${violation.id}`)}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                    >
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Header with Date and Time */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-semibold">
                                                {violation.date ? formatDateToExactString(new Date(violation.date)) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {violation.date ? formatDateToExactTime(new Date(violation.date)) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="destructive" className="w-fit">
                                        {totalPoints} Poin
                                    </Badge>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Siswa</p>
                                            <p className="font-semibold">{violation.students?.length || 0} Siswa</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pelanggaran</p>
                                            <p className="font-semibold">{violation.violation_types?.length || 0} Jenis</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-green-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pencatat</p>
                                            <p className="font-semibold truncate">{violation.creator?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Note Section */}
                                {violation.note && (
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Catatan</p>
                                            <p className="text-sm break-words">{violation.note}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Image Section */}
                                {violation.image && (
                                    <div className="flex items-center gap-2">
                                        <Image className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Bukti Foto</p>
                                            <p className="text-sm font-medium text-blue-600">Tersedia</p>
                                        </div>
                                    </div>
                                )}
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
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {filter.search === '' ? 'Tidak ada data pelanggaran' : 'Data tidak ditemukan'}
                            </h3>
                            <p className="text-muted-foreground">
                                {filter.search === '' 
                                    ? 'Belum ada data pelanggaran untuk ditampilkan' 
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