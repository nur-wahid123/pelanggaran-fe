"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { formatDateToExactString, formatRangeToExactString } from "@/util/date.util"
import { useCallback, useEffect, useState } from "react"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"
import { ChartType, convertToChartTypeEnum } from "@/enums/chart-type.enum"
import { ChartDataType } from "./chart-data-response.dto"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const chartConfig = {
    value: {
        label: "Pelanggaran",
        color: "black",
    }
} satisfies ChartConfig

class Parameters {
    from!: Date
    to!: Date
}

export function ChartData({ from, to }: Parameters) {
    const [data, setData] = useState<ChartDataType[]>([]);
    const [type, setType] = useState<ChartType>(ChartType.DAYS);
    const fetchData = useCallback(async () => {
        const params = { type }
        await axiosInstance.get(ENDPOINT.CHART_DATA, { params }).then(res => {
            setData(res.data.data)
        }).catch(e => {
            console.error(e);
        })
    }, [type])

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [type]);
    return (
        <Card className="h-[400px] justify-between flex flex-col">
            <CardHeader>
                <div>
                    <CardTitle>Data Jumlah Pelanggaran</CardTitle>
                    <CardDescription>{formatRangeToExactString(from, to)}</CardDescription>
                </div>
                <Select value={type} onValueChange={(e)=> {
                    const vl = convertToChartTypeEnum(e);
                    if (vl !== undefined){
                        setType(vl);
                    }else{
                        return
                    }
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Rentang</SelectLabel>
                            <SelectItem value={ChartType.DAYS}>Per Hari</SelectItem>
                            <SelectItem value={ChartType.WEEKS}>Per Minggu</SelectItem>
                            <SelectItem value={ChartType.MONTHS}>Per Bulan</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-[200px] w-full" config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="key"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="value" fill="var(--color-value)" radius={2} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
