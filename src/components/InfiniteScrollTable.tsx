"use client"; // Add this line at the top

import React, { useRef } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTableData, TableData } from "../services/apiService";

const columns: GridColDef[] = [
    { field: "rowId", headerName: "Row ID", width: 150 },
    { field: "serialNo", headerName: "Serial No", width: 200 },
    { field: "phone", headerName: "Phone", width: 200 }
];

const InfiniteScrollTable: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["tableData"],
        queryFn: fetchTableData,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextOffset,
    });

    const rows: TableData[] = data?.pages.flatMap((page) => page.data) || [];

    const handleScroll = () => {
        if (!gridRef.current || !hasNextPage) return;

        const { scrollTop, scrollHeight, clientHeight } = gridRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            fetchNextPage();
        }
    };

    return (
        <div
            ref={gridRef}
            style={{ height: 600, width: "100%", overflow: "auto" }}
            onScroll={handleScroll}
        >
            <DataGrid rows={rows} columns={columns} pageSizeOptions={[50]} />
        </div>
    );
};

export default InfiniteScrollTable;
