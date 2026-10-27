import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppNav from "@/components/AppNav";
import { devPreview } from "@/lib/dev-preview";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user && !devPreview) redirect("/login");

  const isMember = devPreview ? true : (await supabase.rpc("is_studio_member")).data;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap" }}>
      <AppNav email={user?.email ?? "vista-previa@local"} />
      <main className="app-main">
        {isMember ? (
          children
        ) : (
          <div className="card stack" style={{ maxWidth: 560 }}>
            <h1 className="serif" style={{ margin: 0, fontSize: "var(--fs-h1)" }}>Sin acceso todavía</h1>
            <p className="ink2" style={{ margin: 0, lineHeight: 1.6 }}>
              Tu cuenta existe, pero aún no es parte del estudio. La dueña del estudio debe darte acceso.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
