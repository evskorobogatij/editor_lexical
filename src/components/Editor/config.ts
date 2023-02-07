import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import mainTheme from "./theme/theme";
import { AutocompleteNode } from "./nodes/AutocompleteNode";

export const editorConfig: InitialConfigType = {
  // The editor theme
  namespace: "",
  theme: mainTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
    AutocompleteNode,
  ],
};
