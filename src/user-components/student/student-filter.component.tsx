import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ClassObject } from "@/objects/class.object";
import { StudentFilterType } from "@/app/dashboard/student/page";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";

export default function StudentFilterComponent({ filter, setFilter }: { filter: StudentFilterType, setFilter: Dispatch<SetStateAction<StudentFilterType>> }) {
    const [classEtt, setClassEtt] = useState<ClassObject[]>([]);
    const [boool, setBoool] = useState({ classId: false });
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.MASTER_CLASS}`).then((res) => {
            setClassEtt(res.data.data);
        })
    }, [])
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline">Filter <Filter /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogDescription>
                        Pilih Siswa menurut keinginan
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">
                                Nama Kelas
                            </Label>
                            <Popover open={boool.classId} onOpenChange={(open) => setBoool({ ...boool, classId: open })}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={boool.classId}
                                        className="w-[200px] justify-between"
                                    >
                                        {filter.classId
                                            ? classEtt.find((classItem) => classItem.id === filter.classId)?.name
                                            : "Pilih Kelas"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 z-[9999] pointer-events-auto">
                                    <Command>
                                        <CommandInput placeholder="Cari Kelas..." />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {classEtt.map((classItem) => (
                                                    <CommandItem
                                                        key={classItem.id}
                                                        value={classItem.name?.toString()}
                                                        onSelect={(currentValue) => {
                                                            const val = classEtt.find((framework) => framework.name === currentValue)
                                                            if (!val) {
                                                                setFilter({ ...filter, classId: undefined })
                                                            }
                                                            else {
                                                                setFilter({ ...filter, classId: val.id })
                                                            }
                                                            setBoool({ ...boool, classId: false })
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                filter.classId === classItem.id ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {classItem.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}