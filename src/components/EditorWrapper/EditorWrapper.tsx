import { EditorState } from "lexical";
import { useEffect, useMemo, useRef } from "react";
import { Editor } from "../Editor/Editor";

interface EditorWrapperProps {
  initialText: string;
  handleChange?: (v: string) => void;
  draggableBlocks?: boolean;
}
export const EditorWrapper: React.FC<EditorWrapperProps> = ({
  initialText,
  draggableBlocks,
  handleChange,
}) => {
  const editorRef = useRef<EditorState>(null);
  const content = useMemo(
    () => editorRef.current?.toJSON(),
    [editorRef.current]
  );
  useEffect(() => {
    if (handleChange && content !== undefined) {
      handleChange(JSON.stringify(content));
    }
  }, [content]);
  return (
    <Editor
      ref={editorRef}
      initialText={initialText}
      draggableBlocks={draggableBlocks}
    />
  );
};
