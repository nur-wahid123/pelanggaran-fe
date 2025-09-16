'use client'
import ENDPOINT from "@/config/url";
import { RoleEnum } from "@/enums/role.enum";
import { User } from "@/objects/user.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SearchBar from "@/user-components/ui/search-bar";
import AddUser from "@/user-components/user/add-user.component";
import EditUser from "@/user-components/user/update-user.component";
import { UserCircle2, UserCog2, User2, FileText } from "lucide-react";
import { useCallback, useState } from "react";
import clsx from "clsx";

const config = {
    url: ENDPOINT.MASTER_USER,
    title: "Data User",
    key_word: "user",
};

const roleBadge = (role: RoleEnum) => {
    if (role === RoleEnum.USER) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <User2 className="w-4 h-4" /> User
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <UserCog2 className="w-4 h-4" /> Admin
        </span>
    );
};

function violationCountBadge(count: number) {
    return (
        <span className={clsx(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
            count === 0
                ? "bg-green-100 text-green-800"
                : "bg-pink-100 text-pink-800"
        )}>
            <FileText className="w-4 h-4" />
            {count === 0
                ? "Belum pernah mencatat pelanggaran"
                : `${count} pelanggaran dicatat`}
        </span>
    );
}

export default function Page() {
    const [search, setSearch] = useState("");
    const { data, loading, ref, refresh: reFetch } = useInfiniteScroll<User, HTMLDivElement>({ filter: { search }, take: 20, url: config.url });

    const handleSearch = useCallback(function (query: string) {
        if (query !== search) {
            setSearch(query);
        }
    }, [search]);
    return (
        <div className="p-4 w-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl flex items-center gap-2">
                {config.title}
            </h1>
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <AddUser reFetch={reFetch} />
                </div>
                <div className="max-h-[31rem] gap-3 w-full overflow-x-auto overflow-y-auto flex flex-col py-2">
                    {data.map((user, index) => {
                        const isLast = data.length === index + 1;
                        const violationCount = Array.isArray((user as any).violations) ? (user as any).violations.length : 0;
                        return (
                            <div
                                ref={isLast ? ref : undefined}
                                key={user.id}
                                className={clsx(
                                    "flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 border border-slate-200 rounded-xl shadow bg-white dark:bg-gray-800 p-4 transition hover:shadow-lg",
                                    "relative"
                                )}
                            >
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="flex-shrink-0">
                                        <UserCircle2 className="w-12 h-12 text-blue-400 bg-blue-100 rounded-full p-2" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {user.name}
                                            {roleBadge(user.role ?? RoleEnum.USER)}
                                        </div>
                                        <div className="mt-1">
                                            {violationCountBadge(violationCount)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center mt-2 md:mt-0">
                                    <EditUser id={user.id} reFetch={reFetch} />
                                </div>
                            </div>
                        );
                    })}
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-gray-500">Loading...</span>
                        </div>
                    )}
                    {!loading && data.length === 0 && (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-gray-500">
                                {search === '' ? 'Data Kosong' : 'Data Tidak Ditemukan'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}