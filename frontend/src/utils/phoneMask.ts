export const formatPhone = (v: string): string => {
  if (!v || typeof v !== "string") return "";

  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";

  let out = "";
  for (let i = 0; i < d.length; i++) {
    out += d[i];
    if (i === 3 || i === 6) out += " ";
  }
  return out.trim();
};
