import { useEffect } from "react";

/**
 * Sets the document title in the <head>-tag in html. Appends " - Sykefravær" suffix automatically.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title =
      title + (title.length > 0 ? " - Sykefravær" : "Sykefravær");

    return () => {
      document.title = "Sykefravær";
    };
  }, [title]);
}
