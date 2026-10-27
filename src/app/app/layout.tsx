import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppNav from "@/components/AppNav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: isMember } = await supabase.rpc("is_studio_member");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap" }}>
      <AppNav email={user.email ?? ""} />
      <main style={{ flex: "999 1 560px", minWidth: 0, padding: "36px clamp(16px, 4vw, 40px) 56px", display: "flex", flexDirection: "column", gap: 24 }}>
        {isMember ? (
          children
        ) : (
          <div className="card stack" style={{ maxWidth: 560 }}>
            <h1 className="serif" style={{ margin: 0, fontSize: 36 }}>Sin acceso todavía</h1>
            <p className="ink2" style={{ margin: 0, lineHeight: 1.6 }}>
              Tu cuenta existe, pero aún no es parte del estudio. La dueña del estudio debe darte acceso.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
