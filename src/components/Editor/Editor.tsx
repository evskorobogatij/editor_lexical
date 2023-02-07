// import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
// import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
// import AutoLinkPlugin from "@lexical/react/LexicalAutoLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import AutocompletePlugin from "./plugins/AutocomplatePlugin";

import "./style.css";
import { editorConfig } from "./config";
import { useState } from "react";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";

function Placeholder() {
  return (
    <div className="editor-placeholder">
      Введите текст (ПОДСКАЗКА: Нажмите / )
    </div>
  );
}

export function Editor() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <SharedAutocompleteContext>
        <div className="editor-container">
          {/* <ToolbarPlugin /> */}
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <div ref={onRef}>
                  <ContentEditable className="editor-input" />
                </div>
              }
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {/* <TreeViewPlugin /> */}
            <AutoFocusPlugin />
            {/* <CodeHighlightPlugin /> */}
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin />
            <ComponentPickerPlugin />
            <AutocompletePlugin />

            {floatingAnchorElem && (
              <>
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
                <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
              </>
            )}
            <AutoLinkPlugin />
            {/* <ListMaxIndentLevelPlugin maxDepth={7} /> */}
          </div>
        </div>
      </SharedAutocompleteContext>
    </LexicalComposer>
  );
}
