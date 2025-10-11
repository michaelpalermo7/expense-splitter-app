export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA");
