import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(function () {
    return new QueryClient({
      queryCache: new QueryCache(),
      mutationCache: new MutationCache(),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          cacheTime: 1000 * 60 * 60, // 1 hours
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
