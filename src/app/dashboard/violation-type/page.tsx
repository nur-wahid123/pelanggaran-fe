'use client'
import ENDPOINT from "@/config/url";
import { ViolationType } from "@/objects/violation-type.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SearchBar from "@/user-components/ui/search-bar";
import AddViolationType from "@/user-components/violation-type/add-violation-type.component";
import ViolationTypeCard from "@/user-components/violation-type/violation-type-card.components";
import ImportViolationType from "@/user-components/violation-type/violation-type-import.component";
import { useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const { data: violationTypes, loading, ref } = useInfiniteScroll<ViolationType, HTMLTableRowElement>({ filter: { search }, take: 20, url: ENDPOINT.MASTER_VIOLATION_TYPE })
    function handleSearch(query: string) {
        if (query !== search) {
            setSearch(query);
        }
    }

    function reFetch() {
        setSearch('');
    }


    return (
        <div className="p-4 w-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Jenis Pelanggaran
            </h1>
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <AddViolationType reFetch={reFetch} />
                    <ImportViolationType reFetch={reFetch} />
                </div>
                <div className="max-h-[31rem] gap-3 w-full overflow-x-auto overflow-y-auto flex flex-col">
                    {violationTypes.map((violationType, index) => {
                       if(violationTypes.length === index + 1){
                           return <ViolationTypeCard key={index} reFetch={reFetch} ref={ref} violationType={violationType} isLoading={loading} />
                       } else {
                           return <ViolationTypeCard key={index} reFetch={reFetch} violationType={violationType} isLoading={loading} />
                       }
                    })}
                </div>
            </div>
        </div>
    )
}