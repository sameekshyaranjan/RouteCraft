import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ItineraryView({ markdown }) {
  if (!markdown) {
    return (
      <div className="p-4 rounded-xl border border-border bg-ink text-xs text-ink2">
        No itinerary was generated.
      </div>
    );
  }
  return (
    <div className="prose-routecraft">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
