// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useRef, useState } from "react";

import { Editor } from "./components/Editor";

function App() {
  const editorRef = useRef<EditorState>(null);

  // const [editor] = useLexicalComposerContext();

  // editor.parseEditorState()
  
  const handleTrySave = () => {    
    console.log(editorRef.current?.toJSON());
  };

  return (
    // <div className="App">
    //
    <>
      <div className="app-title">
        <h1>Text Editor test</h1>
        <button className="btn-title" onClick={handleTrySave}>
          Сохранить (TEST)
        </button>
      </div>

      <Editor ref={editorRef} />
    </>

    // </div>
  );
}

export default App;
