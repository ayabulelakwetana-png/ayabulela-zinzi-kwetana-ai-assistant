import { Button } from "@/components/ui/button";
import { AiNotice } from "@/components/brand/Bits";
import { renderMarkdown, stripMarkdown } from "@/lib/markdown";
import { Copy, Download, Printer, RefreshCw, Save, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function AiOutput({
  title,
  content,
  onSave,
  onRegenerate,
  saving,
  regenerating,
  editable = false,
  onEdited,
  extraActions,
}: {
  title: string;
  content: string;
  onSave?: () => void;
  onRegenerate?: () => void;
  saving?: boolean;
  regenerating?: boolean;
  editable?: boolean;
  onEdited?: (value: string) => void;
  extraActions?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const html = useMemo(() => renderMarkdown(content), [content]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Your browser blocked copying. Select the text manually.");
    }
  };

  const download = () => {
    const blob = new Blob([stripMarkdown(content)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^\w\s-]/g, "").slice(0, 60) || "studyeazy"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const print = () => {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) {
      toast.error("Your browser blocked the print window.");
      return;
    }
    w.document.write(
      `<!doctype html><title>${title}</title><style>body{font-family:Inter,system-ui,sans-serif;max-width:720px;margin:32px auto;padding:0 16px;line-height:1.6;color:#031A45}h1,h2,h3{color:#031A45}</style><h1>${title}</h1>${html}<p style="margin-top:32px;font-size:12px;color:#555">StudyEazy AI — AI-generated content may require human review.</p>`,
    );
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {extraActions}
          {editable ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (editing) {
                  onEdited?.(draft);
                  toast.success("Changes applied");
                } else {
                  setDraft(content);
                }
                setEditing(!editing);
              }}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> {editing ? "Done" : "Edit"}
            </Button>
          ) : null}
          <Button size="sm" variant="outline" onClick={copy}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
          </Button>
          {onSave ? (
            <Button size="sm" variant="outline" onClick={onSave} disabled={saving}>
              <Save className="mr-1.5 h-3.5 w-3.5" /> {saving ? "Saving..." : "Save"}
            </Button>
          ) : null}
          {onRegenerate ? (
            <Button size="sm" variant="outline" onClick={onRegenerate} disabled={regenerating}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate
            </Button>
          ) : null}
          <Button size="sm" variant="outline" onClick={download}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download
          </Button>
          <Button size="sm" variant="outline" onClick={print}>
            <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
          </Button>
        </div>
      </div>

      {editing ? (
        <textarea
          className="min-h-[420px] w-full rounded-xl border border-input bg-background p-4 font-mono text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Edit generated content"
        />
      ) : (
        <div
          className="brand-prose text-[15px] font-medium text-foreground"
          // Content is model text rendered through an escaping markdown renderer.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      <AiNotice className="mt-6" verify />
    </section>
  );
}
