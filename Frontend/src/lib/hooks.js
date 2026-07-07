import { useQuery, useMutation } from '@tanstack/react-query';
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
    staleTime: Infinity, // Paper contents are immutable once processed
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
