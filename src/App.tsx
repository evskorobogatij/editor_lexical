// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useRef, useState } from "react";

import { Editor } from "./components/Editor";
import { data2, demoTest, initial, nullData } from "./data_sample";

function App() {
  const editorRef = useRef<EditorState>(null);

  const [textData, setTextData] = useState<string>(initial);

  // const [editor] = useLexicalComposerContext();

  // editor.parseEditorState()

  const handleTrySave = () => {
    console.log(JSON.stringify(editorRef.current?.toJSON()));
  };


  const handleDemoData = () => {
    setTextData(demoTest)
  }

  return (
    // <div className="App">
    //
    <>
      <div className="app-title">
        <h1>Text Editor test</h1>
        <button className="btn-title btn-secondary" onClick={handleDemoData}>
          Пример
        </button>
        <button className="btn-title" onClick={handleTrySave}>
          Сохранить (TEST)
        </button>
      </div>

      <Editor ref={editorRef} initialText={textData} />
    </>

    // </div>
  );
}

export default App;
