import { useQuery } from "@tanstack/react-query";
import { getAllUserWorkflows } from "@/lib/actions/workflow";

export function useSearchWorkflows(searchTerm: string, page: number = 1, limit: number = 9) {
  return useQuery({
    // The queryKey uniquely identifies this specific fetch. 
    // If the searchTerm changes, React Query knows to fetch new data.
    queryKey: ["workflows", "search", searchTerm, page, limit],
    queryFn: async () => {
      // Prevent unnecessary database hits if the input is empty
      if (!searchTerm.trim()) return { data: [], totalPages: 0 }; 
      
      const result = await getAllUserWorkflows(page, limit, searchTerm);
      if (!result.success) throw new Error(result.error);
      
      return result;
    },
    // Automatically disable the query if there is no search term
    enabled: searchTerm.trim().length > 0,
    // Keep previous data on the screen while fetching the new data for a smoother UI
    placeholderData: (previousData) => previousData, 
  });
}