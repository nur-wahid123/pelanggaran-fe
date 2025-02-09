import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import React, { useEffect } from "react";
export class PaginateContentProps {
    page?: number = 1;
    take?: number = 20;
    item_count?: number;
    page_count?: number;
    has_previous_page?: boolean;
    has_next_page?: boolean;
}
export class PaginationProps {
    pagination:
        PaginateContentProps | undefined;
    fetchData!: (start: number, limit: number) => void;
}

export const PaginationSelf = ({ pagination, fetchData }: PaginationProps) => {
    
    const currentPage = pagination?.page ?? 1;
    const totalPages = pagination?.page_count ?? 1;
    const isPreviousPageEnabled = pagination?.has_previous_page;
    const isNextPageEnabled = pagination?.has_next_page;
    const paginationLinks = Array.from(
        { length: totalPages ?? 0 },
        (_, index) => index + 1
    ).map((ind, i) => {
        if (ind === currentPage || ind === currentPage + 1 || ind === currentPage - 1) {
            return (
                <PaginationItem onClick={() => fetchData(ind, pagination?.take ?? 20)} key={i}>
                    <PaginationLink isActive={ind === currentPage} href="#">{ind}</PaginationLink>
                </PaginationItem>
            );
        }
    });

    useEffect(() => {
        for (let index = 0; index < (totalPages ?? 1); index++) {

        }
    }, [currentPage, totalPages]);

    return (
        <Pagination>
            <PaginationContent>
                {isPreviousPageEnabled && (
                    <PaginationItem onClick={() => fetchData(1, pagination?.take ?? 20)}>
                        <PaginationLink href='#'>
                            <ChevronsLeftIcon></ChevronsLeftIcon>
                            {1}
                        </PaginationLink>
                    </PaginationItem>
                )}
                {isPreviousPageEnabled && (
                    <PaginationItem onClick={() => fetchData((currentPage ?? 1) - 1, pagination?.take ?? 20)}>
                        <PaginationLink href='#'>
                            <ChevronLeft></ChevronLeft>
                        </PaginationLink>
                    </PaginationItem>
                )}
                {paginationLinks}
                {isNextPageEnabled && (
                    <PaginationItem onClick={() => fetchData((currentPage ?? 1) + 1, pagination?.take ?? 20)}>
                        <PaginationLink href='#'>
                            <ChevronRight></ChevronRight>
                        </PaginationLink>
                    </PaginationItem>
                )}
                {isNextPageEnabled && (
                    <PaginationItem onClick={() => fetchData(totalPages ?? 1, pagination?.take ?? 20)}>
                        <PaginationLink href='#'>
                            {totalPages}
                            <ChevronsRightIcon></ChevronsRightIcon>
                        </PaginationLink>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};
export default PaginationSelf