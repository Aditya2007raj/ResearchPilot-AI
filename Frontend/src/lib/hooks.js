import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export function useUploadPaper(onProgress) {
  return useMutation({
    mutationFn: (file) => api.uploadPdf(file, onProgress),
  });
}

export function usePaperSummary(fileId) {
  return useQuery({
    queryKey: ['workspace', fileId, 'summary'],
    queryFn: () => api.getSummary(fileId),
    enabled: !!fileId,
    staleTime: Infinity,
  });
}

export function usePaperReview(fileId) {
  return useQuery({
    queryKey: ['workspace', fileId, 'review'],
    queryFn: () => api.getReview(fileId),
    enabled: !!fileId,
    staleTime: Infinity,
  });
}

export function usePaperActionPlan(fileId) {
  return useQuery({
    queryKey: ['workspace', fileId, 'action-plan'],
    queryFn: () => api.getActionPlan(fileId),
    enabled: !!fileId,
    staleTime: Infinity,
  });
}

export function useSendMessage(fileId) {
  return useMutation({
    mutationFn: ({ question }) => api.sendChatMessage(fileId, question),
  });
}

export function usePapersList() {
  return useQuery({
    queryKey: ['papers', 'list'],
    queryFn: () => api.getPapers(),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['papers', 'stats'],
    queryFn: () => api.getStats(),
  });
}

export function useFavoritesList() {
  return useQuery({
    queryKey: ['favorites', 'list'],
    queryFn: () => api.getFavorites(),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paperId, isFavorite }) => {
      if (isFavorite) {
        return api.removeFavorite(paperId);
      } else {
        return api.addFavorite(paperId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
