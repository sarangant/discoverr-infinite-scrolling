"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

interface Record {
  rowId: string;
  serialNo: string;
  phone: string;
}

const fetchRecords = async ({ pageParam = 0 }): Promise<Record[]> => {
  try {
    const response = await axios.get<Record[]>(
      `${API_URL}?fields=rowId,serialNo,phone&limit=50&offset=${pageParam}&sorting=rowid-`,
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};

const InfiniteScrollTable: React.FC = () => {
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["records"],
      queryFn: fetchRecords,
      initialPageParam: 0,
      getNextPageParam: (_lastPage, allPages) => {
        const totalRecords = allPages.flat().length;
        return totalRecords >= 50 ? totalRecords : undefined;
      },
    });

  useEffect(() => {
    const container = gridContainerRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10;
      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const records = data?.pages.flat() || [];

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 80,
      renderCell: (params) =>
        records.findIndex((record) => record.rowId === params.row.rowId) + 1,
    },
    { field: "rowId", headerName: "Row ID", width: 150 },
    { field: "serialNo", headerName: "Serial No", width: 150 },
    { field: "phone", headerName: "Phone", width: 200 },
  ];

  return (
    <div ref={gridContainerRef} style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={records}
        columns={columns}
        getRowId={(row) => row.rowId}
        hideFooterPagination
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnSelector
        sortingMode="server"
        loading={isFetchingNextPage}
      />
    </div>
  );
};

export default InfiniteScrollTable;
