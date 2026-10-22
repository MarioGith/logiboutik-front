import { toast } from "react-toastify";

export const notifySuccess = (message) => toast(message, { type: "success" });

// For form checks done before calling the API.
export const notifyInvalid = (message) => toast(message, { type: "error" });

// Shows an error as a French message. The API answers { code, message };
// `code` is translated with the "errors" keys of common.json, unknown codes
// and non-API errors (e.g. PDF creation) fall back to a generic message.
export function notifyError(err, t) {
  const code = err?.response?.data?.code;
  const message =
    err?.isAxiosError && !err.response
      ? t("errors.network", { ns: "common" })
      : t(`errors.${code}`, {
          ns: "common",
          defaultValue: t("errors.server_error", { ns: "common" }),
        });
  toast(message, { type: "error" });
}
