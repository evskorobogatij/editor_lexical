import { useState } from "react";

import { Editor } from "./components/Editor";

function App() {
  const [count, setCount] = useState(0);

  return (
    // <div className="App">
    //
    <>
      <h1>Text Editor test</h1>
      <Editor />
    </>

    // </div>
  );
}

export default App;
