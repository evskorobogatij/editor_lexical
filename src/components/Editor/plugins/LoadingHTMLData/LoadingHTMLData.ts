import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $setSelection } from "lexical";
import { useEffect } from "react";

export const LoadingHTMLData = ({ html }: { html: string }): null => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();
      root.append(...nodes);
      $setSelection(null);
    });
  }, [html]);

  return null;
};
