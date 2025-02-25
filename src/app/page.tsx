import React from "react";
import InfiniteScrollTable from "../components/InfiniteScrollTable"; // Ensure correct path

const Page: React.FC = () => {
  return (
    <div>
      <h1>Data Table with Infinite Scrolling</h1>
      <InfiniteScrollTable />
    </div>
  );
};

export default Page;
