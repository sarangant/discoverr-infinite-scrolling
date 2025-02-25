"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { Record } from "../types/interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

const fetchRecords = async ({ pageParam = 0 }): Promise<Record[]> => {
  try {
    const { data } = await axios.get<Record[]>(
      `${API_URL}?fields=rowId,serialNo,phone&limit=50&offset=${pageParam}&sorting=rowid-`,
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
    return data;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};

const InfiniteScrollTable: React.FC = () => {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["records"],
      queryFn: fetchRecords,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        allPages.flat().length >= 50 ? allPages.flat().length : undefined,
    });

  useEffect(() => {
    const container = gridContainerRef.current?.querySelector<HTMLDivElement>(
      ".MuiDataGrid-virtualScroller"
    );
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 10 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const records: Record[] = data?.pages.flat() || [];

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
        loading={isFetchingNextPage}
      />
    </div>
  );
};

export default InfiniteScrollTable;
