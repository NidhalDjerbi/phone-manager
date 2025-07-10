import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPhone } from "../api/phone";

export function useCreatePhone(onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPhone,
    onSuccess: () => {
      queryClient.invalidateQueries(["phones"]);
      onSuccess?.();
    },
    onError
  });
}
