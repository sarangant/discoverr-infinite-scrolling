export interface TableData {
  rowId: number;
  serialNo: string;
  phone: string;
}

export const fetchTableData = async ({
  pageParam = 0,
}): Promise<{ data: TableData[]; nextOffset: number }> => {
  const limit = 50;
  const url = `https://demo.discoverr.io/spacequery/sql/select/box?fields=rowId,serialNo,phone&limit=${limit}&offset=${pageParam}&sorting=rowid-&accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lc3RhbXAiOiJOT05FIiwiYXV0aElkIjoiZmMzNjNhYjItYWEyMy1lOTExLWJkMDctMDAwYWNkMzIyNjNiIiwicm9sZSI6IkFETUlOIiwiY3VzdG9tZXJObyI6MCwiY2hhaW5JZCI6IiJ9.akYvlBnTZDAyyBd_7Pvhu7U1xdAivcbQjUnJtuWOG6U`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");

  const data = await response.json();
  return { data: data.result, nextOffset: pageParam + limit };
};
