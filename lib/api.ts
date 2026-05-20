import { ApiResponse } from "@/types/api.types"

export async function apiPost<TRes, TReq = unknown>(
  url: string,
  payload: TReq
): Promise<ApiResponse<TRes>> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to execute request")
  }

  return data
}
