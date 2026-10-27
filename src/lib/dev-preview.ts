/**
 * Solo desarrollo local: con DEV_PREVIEW=1 en .env.local se omite el login para ver la UI de /app.
 * Nunca se activa en producción (exige NODE_ENV === "development"). Los datos siguen protegidos por RLS:
 * sin sesión las consultas vuelven vacías.
 */
export const devPreview = process.env.NODE_ENV === "development" && process.env.DEV_PREVIEW === "1";
