import { axiosInstance } from "@/util/request.util";
import axios, { Canceler } from "axios";
import { useEffect, useMemo, useState } from "react";

class useInfiniteScrollParam {
    url!: string
    take!: number
    filter!: object
    page!: number
}

export default function useInfiniteScroll<T>({ filter, take, url, page }: useInfiniteScrollParam) {
    const [data, setData] = useState<T[]>([]);
    const memoizedFilter = useMemo(() => filter, [JSON.stringify(filter)]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setData([]);
        setHasMore(true);
        setError(false);
    }, [memoizedFilter]);

    useEffect(() => {
        let cancel: Canceler;
        setLoading(true);
        axiosInstance.get(url, {
            params: {
                page: page,
                take: take,
                ...memoizedFilter
            },
            cancelToken: new axios.CancelToken(c => { cancel = c })
        })
            .then(res => {
                if (Array.isArray(res.data.data)) {
                    setData(prevData => [...prevData, ...res.data.data]);
                    setHasMore(res.data.pagination.has_next_page)
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setError(true);
            });
        return () => cancel();
    }, [page, take, memoizedFilter]);
    return { data, loading, hasMore, error };
}