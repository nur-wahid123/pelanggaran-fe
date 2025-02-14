'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { Student } from "@/objects/student.object";
import StudentFilterComponent from "@/user-components/student/student-filter.component";
import ImportStudent from "@/user-components/student/student-import.component";
import PaginationSelf, { PaginateContentProps } from "@/user-components/ui/pagination";
import SearchBar from "@/user-components/ui/search-bar";
import { axiosInstance } from "@/util/request.util";
import { Download, Eye } from "lucide-react";
import ExcelJS from "exceljs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";


export interface StudentFilterType {
  classId?: number;
  search: string;
}

export default function Page() {
  const [data, setData] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginateContentProps>({});
  const [filter, setFilter] = useState<StudentFilterType>({
    classId: undefined,
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Input Siswa');
    const columns = [
      { header: 'Nama', width: 40 },
      { header: 'NISN', width: 20 },
      { header: 'NIS', width: 8 },
      { header: 'Kelas', width: 8 },
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
    a.download = `Template Input Siswa.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const fetchData = useCallback(
    async (start: number, limit: number) => {
      try {
        const params: Record<string, any> = {
          page: start,
          take: limit,
          search: filter.search,
        };
        if (filter.classId !== undefined) {
          params.class_id = filter.classId;
        }

        const res = await axiosInstance.get(`${ENDPOINT.MASTER_STUDENT}`, {
          params,
        });

        if (Array.isArray(res.data.data)) {
          setData(res.data.data);
        }
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    },
    [filter]
  );

  useEffect(() => {
    fetchData(pagination?.page ?? 1, pagination?.take ?? 20);
  }, [pagination?.page, pagination?.take, filter]);

  useEffect(() => {
    fetchData(pagination?.page ?? 1, pagination?.take ?? 20);
    return () => { };
  }, []);

  function handleSearch(query: string) {
    if (query !== filter.search) {
      setPagination({ ...pagination, page: 1 });
      setFilter({ ...filter, search: query });
    }
  }

  function reFetch() {
    fetchData(1, pagination.take ?? 20);
  }

  const tableHeader: string[] = ["Nama", "NIS", "Kelas", "Pelanggaran", "Detail"];
  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
        Siswa
      </h1>
      <div className="flex justify-between items-center my-4 gap-4">
        <SearchBar isLoading={isLoading} onSearch={handleSearch} />
        <StudentFilterComponent filter={filter} setFilter={setFilter} />
        <div className="flex gap-4 items-center">
          <Select
            value={pagination?.take?.toString()}
            onValueChange={(e) =>
              setPagination({ ...pagination, take: Number(e), page: 1 })
            }
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((item) => (
                <SelectItem key={item} value={item.toString()}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="w-full line-clamp-1">dari {pagination.item_count} data</p>
        <PaginationSelf pagination={pagination} fetchData={fetchData} />
        <Button onClick={handleDownload}>Download template <Download /></Button>
        <ImportStudent reFetch={reFetch} />
      </div>
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow>
            {tableHeader.map((thead, i) => (
              <TableHead key={i}>{thead}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((student, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="font-semibold">{student.name}</div>
                <div className="text-sm text-slate-500">
                  {student.national_student_id}
                </div>
              </TableCell>
              <TableCell>{student.school_student_id}</TableCell>
              <TableCell>{student.student_class?.name}</TableCell>
              <TableCell>{student.violations?.length}</TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/master/student/${student.national_student_id}`}
                >
                  <Button disabled={isLoading}>
                    <Eye />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}