import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePhone } from "../api/phone";

export function useUpdatePhone(onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePhone,
    onSuccess: () => {
      queryClient.invalidateQueries(["phones"]);
      onSuccess?.();
    },
    onError
  });
}
