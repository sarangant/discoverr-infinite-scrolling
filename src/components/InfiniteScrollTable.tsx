"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DataGridPro,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import axios from "axios";
import { CircularProgress, Box, Paper } from "@mui/material";
import { Record } from "../types/interface";
import styles from "@/styles/InfiniteScrollTable.module.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

const fetchRecords = async ({
  pageParam = 0,
  searchQuery = "",
}): Promise<Record[]> => {
  try {
    const { data } = await axios.get<Record[]>(
      `${API_URL}?fields=rowId,serialNo,phone&limit=50&offset=${pageParam}&sorting=rowid-&search=${searchQuery}`,
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
    return data;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};

const CustomToolbar = () => (
  <GridToolbarContainer>
    <Box sx={{ marginLeft: "auto", display: "flex", gap: 1 }}>
      <GridToolbarQuickFilter />
      <GridToolbarExport />
    </Box>
  </GridToolbarContainer>
);

const InfiniteScrollTable: React.FC = () => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["records", searchQuery],
      queryFn: ({ pageParam }) => fetchRecords({ pageParam, searchQuery }),
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
    { field: "rowId", headerName: "Row ID", width: 150 },
    { field: "serialNo", headerName: "Serial No", width: 150 },
    { field: "phone", headerName: "Phone", width: 200 },
  ];

  return (
    <Paper className={styles.tableContainer}>
      <Box ref={gridContainerRef} className={styles.gridContainer}>
        <DataGridPro
          rows={records}
          columns={columns}
          getRowId={(row) => row.rowId}
          loading={isFetchingNextPage}
          checkboxSelection
          slots={{ toolbar: CustomToolbar }}
          className={styles.dataGrid}
        />
        {isFetchingNextPage && (
          <Box className={styles.loadingIndicator}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default InfiniteScrollTable;
