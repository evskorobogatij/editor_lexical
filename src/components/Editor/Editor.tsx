// import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
// import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
// import AutoLinkPlugin from "@lexical/react/LexicalAutoLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import AutocompletePlugin from "./plugins/AutocomplatePlugin";
import { DraggableBlockPlugin } from "./plugins/DraggableBlockPlugin";

import "./style.css";
import { editorConfig } from "./config";
import { forwardRef, useEffect, useRef, useState } from "react";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import {
  $getRoot,
  $insertNodes,
  EditorState,
  $applyNodeReplacement,
  $setSelection,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MarkdownPlugin } from "./plugins/MarkdownShortcutPlugin";
import { $generateNodesFromDOM } from "@lexical/html";
import { LoadingHTMLData } from "./plugins/LoadingHTMLData";

function Placeholder() {
  return (
    <div className="editor-placeholder" style={{ paddingLeft: "24px" }}>
      Введите текст (ПОДСКАЗКА: Нажмите / )
    </div>
  );
}

interface EditorProps {
  initialText?: string;
  htmlSource?: string;
  draggableBlocks?: boolean;
}

interface LoadingDataPluginsProps {
  data: string;
}
const LoadingDataPlugins = ({ data }: LoadingDataPluginsProps): null => {
  console.log(data);
  const [editor] = useLexicalComposerContext();
  const editorState = editor.parseEditorState(data);
  editor.setEditorState(editorState);

  useEffect(() => {
    console.log("DATA CHANGED", data);
  }, [data]);

  return null;
};

export const Editor = forwardRef<EditorState, EditorProps>(
  ({ initialText, htmlSource, draggableBlocks = false }, editorStateRef) => {
    const [floatingAnchorElem, setFloatingAnchorElem] =
      useState<HTMLDivElement | null>(null);

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
      if (_floatingAnchorElem !== null) {
        setFloatingAnchorElem(_floatingAnchorElem);
      }
    };

    const ref = useRef<EditorState>(null);

    // console.log(editorStateRef.current)
    const handleEditorChange = (editorState: EditorState) => {
      if (editorStateRef !== null) {
        // @ts-ignore
        editorStateRef.current = editorState;
      }
    };

    return (
      // @ts-ignore
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(initialText && { editorState: initialText }),
        }}
      >
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
              <OnChangePlugin onChange={handleEditorChange} />
              <HistoryPlugin />
              {/* <TreeViewPlugin /> */}
              <AutoFocusPlugin />
              {/* <CodeHighlightPlugin /> */}
              <ListPlugin />
              <TabIndentationPlugin />
              <CheckListPlugin />
              <LinkPlugin />
              <ComponentPickerPlugin />
              <MarkdownPlugin />
              {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
              <AutocompletePlugin />
              {initialText && <LoadingDataPlugins data={initialText} />}
              {htmlSource && <LoadingHTMLData html={htmlSource} />}

              {floatingAnchorElem && (
                <>
                  <FloatingTextFormatToolbarPlugin
                    anchorElem={floatingAnchorElem}
                  />
                  <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                  {draggableBlocks && (
                    <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                  )}
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
);
