import { axiosInstance } from "@/util/request.util";
import axios, { Canceler } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

class useInfiniteScrollParam {
  url!: string;
  take!: number;
  filter!: object;
}

export default function useInfiniteScroll<T, T2>({
  filter,
  take,
  url,
}: useInfiniteScrollParam) {
  const [data, setData] = useState<T[]>([]);
  const memoizedFilter = useMemo(() => filter, [JSON.stringify(filter)]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: T2) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node && node instanceof Element) observer.current.observe(node);
    },
    [loading, hasMore],
  );


  const refresh = useCallback((isNotRefresh?: boolean): Canceler | undefined => {
    setLoading(true);
    let cancel: Canceler | undefined;

    axiosInstance
      .get(url, {
        params: {
          page,
          take,
          ...memoizedFilter,
        },
        cancelToken: new axios.CancelToken((c) => {
          cancel = c;
        }),
      })
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          // kalau mau reset data setiap ganti filter:
          if (!isNotRefresh) {
            setData(res.data.data);
          } else {
            // kalau mau infinite scroll:
            setData((prevData) => [...prevData, ...res.data.data]);
          }

          setHasMore(res.data.pagination?.has_next_page ?? false);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.error(err);
          setError(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return cancel;
  }, [url, page, take, memoizedFilter]);

  useEffect(() => {
    setData([]);
    setHasMore(true);
    setError(false);
    setPage(1);
  }, [memoizedFilter]);

  useEffect(() => {
    const cancel = refresh(false);
    return () => {
      if (cancel) cancel();
    };
  }, [page, take, memoizedFilter, refresh]);

  return { data, loading, hasMore, error, ref, refresh };
}

