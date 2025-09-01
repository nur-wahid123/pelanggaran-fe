"use client"

export function ChartBarMixed({ data }: {
    data: {
        name: string;
        value: number;
    }[] | undefined
}) {
    const borderColors = [
        "border-slate-800",
        "border-slate-400",
        "border-slate-100",
    ];

    return (
        <div className="border flex flex-col gap-4 p-6 h-full border-gray-200 rounded-md">
            <div className="text-2xl font-semibold">Pelanggaran Terbanyak</div>
            <div className="w-full flex flex-col gap-2">
                {data?.map((item, i) => (
                    <div
                        key={i}
                        className={`flex p-2 rounded-md justify-between border-2 ${borderColors[i] || "border-slate-400"}`}
                        style={{ width: `${(item.value / data[0].value) * 100}%` }}
                    >
                        <div>{item.name}</div>
                        <div>{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );

}
