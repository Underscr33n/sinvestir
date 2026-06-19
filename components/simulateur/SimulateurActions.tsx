import { BookmarkPlus, Share2, RotateCcw } from "lucide-react";

interface SimulateurActionsProps {
  onReset: () => void;
}

export function SimulateurActions({ onReset }: SimulateurActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold"
        style={{ background: "var(--si-primary)", color: "#fff" }}
      >
        <BookmarkPlus size={15} />
        Enregistrer la simulation
      </button>
      <button
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold border"
        style={{ borderColor: "var(--si-text)", color: "var(--si-text)", background: "transparent" }}
      >
        <Share2 size={15} />
        Partager mes résultats
      </button>
      <button
        onClick={onReset}
        title="Réinitialiser"
        className="sm:px-4 py-3 rounded-full border text-sm flex items-center justify-center"
        style={{ borderColor: "var(--si-border)", color: "var(--si-text-secondary)", background: "transparent" }}
      >
        <RotateCcw size={15} />
      </button>
    </div>
  );
}
