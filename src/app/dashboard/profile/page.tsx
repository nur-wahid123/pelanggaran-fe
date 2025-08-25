"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ENDPOINT from "@/config/url";
import { User } from "@/objects/user.object";
import { axiosInstance } from "@/util/request.util";
import { Mail, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Page() {

    const [user, setUser] = useState<User>({} as User);

    const fetchUser = useCallback(async () => {
        await axiosInstance.get(ENDPOINT.PROFILE).then((res) => {
            setUser(res.data.data);
        });
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 items-center">
                <div className="text-2xl font-bold">{user.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" /> {user.email}
                </div>
            </div>

            <div className="flex items-center w-full flex-col md:flex-row gap-4 max-w-72 mt-12 justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Mencatat Pelanggaran</span>
                </div>
                {user.violations?.length === 0 ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                        ✅ Tidak Pernah
                    </Badge>
                ) : (
                    <Badge variant="destructive">
                        {user.violations?.length} Kali
                    </Badge>
                )}
            </div>
        </div>
    );
}