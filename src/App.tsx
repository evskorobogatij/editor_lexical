// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { useRef, useState } from "react";

import { Editor } from "./components/Editor";
import { data2, demoTest, initial, nullData } from "./data_sample";

function App() {
  const editorRef = useRef<EditorState>(null);

  const [textData, setTextData] = useState<string>(initial);
  const [isBlockDraggable, setIsBlockDraggable] = useState(true);

  // const [editor] = useLexicalComposerContext();

  // editor.parseEditorState()

  const handleTrySave = () => {
    console.log(JSON.stringify(editorRef.current?.toJSON()));
  };

  const handleDemoData = () => {
    setTextData(demoTest);
  };

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

      <div style={{ marginLeft: "32px", display: "none" }}>
        <input
          type={"checkbox"}
          id="movedBlock"
          checked={isBlockDraggable}
          onChange={(e) => setIsBlockDraggable(e.target.checked)}
        />
        <label htmlFor="movedBlock">Перемещаемые блоки</label>
      </div>

      <Editor
        ref={editorRef}
        htmlSource={"<h1>Testting HTML</h1>"}
        // initialText={textData}
        draggableBlocks={isBlockDraggable}
        // onChange={(s) => console.log(s)}
        // onChangeAsHTML={(html) => console.log(html)}
      />
    </>

    // </div>
  );
}

export default App;
