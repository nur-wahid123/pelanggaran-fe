"use client"

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ChartBarMixed({ data }: {
    data: {
        name: string;
        value: number;
    }[] | undefined
}) {
    const maxValue = data && data.length > 0 ? Math.max(...data.map(item => item.value)) : 0;


    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return "🥇";
            case 1: return "🥈";
            case 2: return "🥉";
            default: return `${index + 1}.`;
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <div className="text-lg font-medium">Tidak ada data</div>
                <div className="text-sm">Belum ada data pelanggaran untuk ditampilkan</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((item, i) => (
                <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                                {getRankIcon(i)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium break-words leading-tight" title={item.name}>
                                    {item.name}
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                            {item.value}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <Progress 
                            value={(item.value / maxValue) * 100} 
                            className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>{maxValue}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
