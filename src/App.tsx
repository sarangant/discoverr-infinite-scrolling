import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Page from "./app/page"; // Ensure this is correctly imported

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
};

export default App;
