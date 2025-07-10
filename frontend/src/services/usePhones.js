import { useQuery } from "@tanstack/react-query";
import { getPhones } from "../api/phone";

export function usePhones() {
  return useQuery({
    queryKey: ["phones"],
    queryFn: getPhones,
  });
}
