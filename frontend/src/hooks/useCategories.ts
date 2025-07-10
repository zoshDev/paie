import { useQuery } from '@tanstack/react-query';
import { categorieService } from '@/services/categorieService';

export default function useCategories() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: categorieService.list,
  });

  return {
    categories: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}
