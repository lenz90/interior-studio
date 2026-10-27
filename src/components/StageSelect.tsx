"use client";

import { useTransition } from "react";
import { CLIENT_STAGES } from "@/lib/format";
import { updateClientStage } from "@/app/app/actions";

export default function StageSelect({ id, stage }: { id: string; stage: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <label>
      <span className="sr-only">Etapa</span>
      <select
        className={`badge badge-${stage}`}
        defaultValue={stage}
        disabled={pending}
        onChange={(e) => { const v = e.currentTarget.value; startTransition(() => updateClientStage(id, v)); }}
        style={{ border: 0, font: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
      >
        {Object.entries(CLIENT_STAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </label>
  );
}
