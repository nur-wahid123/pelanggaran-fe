'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { DashboardResponseDto } from "@/objects/dashboard-response.dto";
import { DateRange, formatDate, formatDateToExactString, thisMonth, thisWeek } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { useCallback, useEffect, useState } from "react";
import { DatePickerWithRange } from "./date-picker";

export default function Statistics() {
  const [data, setData] = useState<DashboardResponseDto>({ student_with_point_more_than_30: [] });
  const toaster = useToast();
  const [dateRange, setDateRange] = useState<DateRange>({ start_date: formatDate(new Date()), finish_date: formatDate(new Date()) });
  const qry = thisMonth();
  const fetcData = useCallback(async () => {
    const dtRg = new DateRange();
    dtRg.start_date = dateRange.start_date;
    dtRg.finish_date = dateRange.finish_date;

    await axiosInstance.get(`${ENDPOINT.DASHBOARD_DATA}`, { params: dtRg }).then((res) => {
      setData(res.data.data);
    }).catch(() => {
      toaster.toast({ title: "Error", description: "Gagal Mendapatkan Data", variant: "destructive" })
    });
  }, [dateRange]);

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
    fetcData();
  }, [])
  return (
    <div className="flex flex-col gap-5">

      <div className=" flex justify-between items-center">
        <Tabs defaultValue='this_month' className="w-full items-center flex gap-6">
          <TabsList>
            <TabsTrigger onClick={() => setDate(qry.startOfMonth, qry.endOfMonth)} value="this_month">Bulan Ini</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="this_month">
          </TabsContent>
          <TabsContent className="flex mt-0 items-center" value="custom">
            <DatePickerWithRange setOutDate={setDate} />
          </TabsContent>
        </Tabs>
        <div className="text-md text-muted-foreground flex items-center w-fit whitespace-nowrap font-semibold">
          {formatDateToExactString(new Date(dateRange.start_date))} - {formatDateToExactString(new Date(dateRange.finish_date))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="max-w-1/4 flex flex-col gap-5 w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div>Total Pelanggaran</div>
          <div className="flex justify-between">
            <div className="text-4xl font-bold">{data.total_violation}</div>
            <div className=" flex text-sm gap-2 items-end">
              <div className={`font-semibold text-xs rounded-xl p-1 ${data.violation_percentage_from_last_month ? data.violation_percentage_from_last_month < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{data.violation_percentage_from_last_month ? data.violation_percentage_from_last_month > 0 ? `+${data.violation_percentage_from_last_month}%` : `${data.violation_percentage_from_last_month}%` : `0%`}</div>
              <div>dari bulan lalu</div>
            </div>
          </div>
        </div>

        <div className="max-w-1/4 flex flex-col gap-5 w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div>Total Poin</div>
          <div className="flex gap-4">
            <div className="text-4xl font-bold">{data.total_point}</div>
            <div className=" flex text-md gap-2 items-end">Poin</div>
          </div>
        </div>

        <div className="max-w-1/4 flex flex-col gap-5 w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div>Total Siswa</div>
          <div className="flex gap-4">
            <div className="text-4xl font-bold">{data.total_student}</div>
            <div className=" flex text-md gap-2 items-end">Siswa</div>
          </div>
        </div>

        <div className="max-w-1/4 flex flex-col gap-5 w-full p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div>Pelanggaran Terbanyak</div>
          <div className="flex gap-4">
            <div className="text-2xl overflow-x-auto overflow-y-hidden font-bold whitespace-nowrap">{data.most_violation_type?.name ? data.most_violation_type?.name : '-'}</div>
            {/* <div className=" flex text-md gap-2 items-end">Siswa</div> */}
          </div>
        </div>

      </div>
    </div>
  )
}