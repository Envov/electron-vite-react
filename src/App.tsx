import { useState } from "react";
import "./App.scss";

console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function App() {
  const [targetPath, targetPathSet] = useState("");
  const onGetTargetFilePath: React.DOMAttributes<HTMLInputElement>["onDrag"] = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const items = e.dataTransfer.items;
    if (!items.length) return;
    if (items[0].kind === "file" && items[0]?.webkitGetAsEntry()?.isFile) {
      const pathFile = items[0]?.getAsFile()?.path || ""; //文件路径
      console.log(pathFile);
      targetPathSet(pathFile);
    }
    console.log(items);
  };
  return (
    <div className="App">
      <div className="flex-row">
        <input
          value={targetPath}
          type="text"
          onChange={(e) => targetPathSet(e.target.value)}
          placeholder="拖入目标文件夹"
          style={{ marginRight: 10, width: "350px" }}
          onDragOver={(e) => e.preventDefault()}
          // onDragEnter={onGetTargetFilePath}
          onDrop={onGetTargetFilePath}
        />
        <button>转换</button>
      </div>
    </div>
  );
}

export default App;
