export const api = (
  action: "register" | "auth" | "validate",
  body: Record<any, any>
) =>
  fetch(`/api/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((resp) => resp.json());
