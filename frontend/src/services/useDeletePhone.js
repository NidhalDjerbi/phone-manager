import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePhone } from "../api/phone";

export function useDeletePhone(onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhone,
    onSuccess: () => {
      queryClient.invalidateQueries(["phones"]);
      onSuccess?.();
    },
    onError
  });
}
