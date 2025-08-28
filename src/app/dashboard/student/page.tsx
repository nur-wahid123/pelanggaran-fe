'use client';
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { Student } from "@/objects/student.object";
import StudentFilterComponent from "@/user-components/student/student-filter.component";
import ImportStudent from "@/user-components/student/student-import.component";
import { PaginateContentProps } from "@/user-components/ui/pagination";
import SearchBar from "@/user-components/ui/search-bar";
import { axiosInstance } from "@/util/request.util";
import { Download } from "lucide-react";
import ExcelJS from "exceljs";
import { useCallback, useEffect, useRef, useState } from "react";
import axios, { Canceler } from "axios";
import StudentCard from "@/user-components/student/student-card.component";


export interface StudentFilterType {
  classId?: number;
  search: string;
}

export default function Page() {
  const [data, setData] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginateContentProps>({ page: 1, take: 20 });
  const [filter, setFilter] = useState<StudentFilterType>({
    classId: undefined,
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && pagination.has_next_page) {
        setPagination((prev) => ({ ...prev, page: (prev?.page ?? 1) + 1 }));
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, pagination]);

  async function handleDownload() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Input Siswa');
    worksheet.columns = [
      { header: 'Nama', width: 40 },
      { header: 'NISN', width: 20 },
      { header: 'NIS', width: 8 },
      { header: 'Kelas', width: 8 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
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

  const fetchData = useCallback(async (start: number, limit: number) => {
    setIsLoading(true);
    let cancel: Canceler;
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
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      });

      if (Array.isArray(res.data.data)) {
        setData((prevData) =>
          start === 1 ? res.data.data : [...prevData, ...res.data.data]
        );
      }

      if (res.data.pagination) {
        setPagination((prev) => ({
          ...prev,
          has_next_page: res.data.pagination.has_next_page,
        }));
      }
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      setIsLoading(false);
    }
    return () => cancel?.();
  }, [filter]);

  useEffect(() => {
    fetchData(1, pagination.take ?? 20); // Start from page 1 on filter change
  }, [filter]);

  useEffect(() => {
    fetchData(pagination?.page ?? 1, pagination.take ?? 20);
  }, [pagination.page]);

  function handleSearch(query: string) {
    if (query !== filter.search) {
      setData([]);
      setPagination({ page: 1, take: pagination.take ?? 20 }); // Reset page to 1
      setFilter((prev) => ({ ...prev, search: query }));
    }
  }

  const reFetch = useCallback(() => {
    setPagination({ page: 1, take: pagination.take ?? 20 }); // Reset to first page
  }, [setPagination])

  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
        Siswa
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-center my-4 gap-4">
        <SearchBar onSearch={handleSearch} />
        <StudentFilterComponent filter={filter} setFilter={setFilter} />
        <Button onClick={handleDownload}>Download template <Download /></Button>
        <ImportStudent reFetch={reFetch} />
      </div>
      <div className="max-h-[31rem] w-full flex flex-col gap-2 overflow-y-auto">
        {data.map((student, i) => {
          if (data.length === i + 1) {
            return (
              <StudentCard isLoading={isLoading} student={student} ref={lastElementRef} key={i} />)
          } else {
            return (
              <StudentCard isLoading={isLoading} student={student} key={i} />
            )
          }
        })}
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            Loading..
          </div>
        )}
        {data.length === 0 && !isLoading && (
          <div className="flex justify-center items-center h-full">
            {filter.search !== "" ? "Data Tidak Ditemukan" : "Data Kosong"}
          </div>
        )}
      </div>
    </div>
  )
}