import { useQuery } from '@tanstack/react-query';
import { echelonService } from '@/services/echelonService';

export default function useEchelons() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['echelons'],
    queryFn: echelonService.list,
  });

  return {
    echelons: data ?? [],
    isLoading,
    isError,
    refetch,
  };
}
