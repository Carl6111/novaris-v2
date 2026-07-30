import type { JsonLdNode } from "../../lib/schema";

/**
 * JSON.stringify escaped kein "</script>" — steckt so eine Zeichenfolge in einem
 * der Texte, bricht sie den Script-Block auf. Die Ersetzung schließt das aus,
 * bleibt aber gültiges JSON.
 */
function serialize(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLd({ data }: { data: JsonLdNode | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
