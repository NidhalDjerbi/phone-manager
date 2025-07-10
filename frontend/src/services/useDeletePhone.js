import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePhone } from "../api/phone";

export function useDeletePhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhone,
    onSuccess: () => {
      queryClient.invalidateQueries(["phones"]);
    },
  });
}
