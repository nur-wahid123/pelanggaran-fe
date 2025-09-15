'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { DashboardResponseDto } from "@/objects/dashboard-response.dto";
import { DateRange, formatDate, formatDateToExactString, thisMonth } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { useCallback, useEffect, useState } from "react";
import { DatePickerWithRange } from "./date-picker";
import { ChartData } from "./chart-data";
import { ChartBarMixed } from "./bar-charts-data.component";
import { AlertTriangle, Users, TrendingUp, Award, Calendar, BarChart3 } from "lucide-react";

export default function Statistics() {
  const [data, setData] = useState<DashboardResponseDto>({ student_with_point_more_than_30: [] });
  const [isLoading, setIsLoading] = useState(true);
  const toaster = useToast();
  const [dateRange, setDateRange] = useState<DateRange>({ start_date: formatDate(new Date()), finish_date: formatDate(new Date()) });
  const qry = thisMonth();
  const fetcData = useCallback(async () => {
    setIsLoading(true);
    const dtRg = new DateRange();
    dtRg.start_date = dateRange.start_date;
    dtRg.finish_date = dateRange.finish_date;

    await axiosInstance.get(`${ENDPOINT.DASHBOARD_DATA}`, { params: dtRg }).then((res) => {
      setData(res.data.data);
    }).catch(() => {
      toaster.toast({ title: "Error", description: "Gagal Mendapatkan Data", variant: "destructive" })
    }).finally(() => {
      setIsLoading(false);
    });
  }, [dateRange, toaster]);

  function setDate(from: Date, to: Date) {
    const dtre = new DateRange();
    dtre.start_date = formatDate(from);
    dtre.finish_date = formatDate(to);
    setDateRange(dtre);
  }

  useEffect(() => {
    fetcData();
  }, [dateRange])
  useEffect(() => {
    setDate(qry.startOfMonth, qry.endOfMonth);
    // fetcData();
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Ringkasan data pelanggaran dan statistik
            </p>
          </div>
          
          {/* Date Range Selector */}
          <Card className="w-full sm:w-auto">
            <CardContent className="p-4">
              <Tabs defaultValue='this_month' className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger 
                    onClick={() => setDate(qry.startOfMonth, qry.endOfMonth)} 
                    value="this_month"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Bulan Ini
                  </TabsTrigger>
                  <TabsTrigger 
                    value="custom"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Custom
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="this_month" className="mt-4">
                  <div className="text-sm text-muted-foreground text-center">
                    Menampilkan data bulan ini
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="mt-4">
                  <DatePickerWithRange 
                    startDate={new Date(dateRange.start_date)} 
                    finishDate={new Date(dateRange.finish_date)} 
                    setOutDate={setDate} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Date Range Display */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Periode:</span>
              <span className="text-muted-foreground">
                {formatDateToExactString(new Date(dateRange.start_date))} - {formatDateToExactString(new Date(dateRange.finish_date))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Violations Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggaran</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.total_violation || 0}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {data.violation_percentage_from_last_month !== undefined && (
                <Badge 
                  variant={data.violation_percentage_from_last_month < 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {data.violation_percentage_from_last_month > 0 ? "+" : ""}{data.violation_percentage_from_last_month}%
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">dari bulan lalu</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Points Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Poin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.total_point || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total poin pelanggaran</p>
          </CardContent>
        </Card>

        {/* Total Students Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data.total_student || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Jumlah siswa terdaftar</p>
          </CardContent>
        </Card>

        {/* Most Violation Type Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggaran Terbanyak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold break-words leading-tight">
              {isLoading ? "..." : data.most_violation_type?.name || '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Jenis pelanggaran paling sering</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Analisis Data</h2>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Pelanggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartData from={new Date(dateRange.start_date)} to={new Date(dateRange.finish_date)} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Pelanggaran</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartBarMixed data={data.leaderboard} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}