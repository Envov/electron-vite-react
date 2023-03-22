import { useEffect, useState } from "react";
import "./App.scss";
import { contextBridge, ipcRenderer, Notification } from 'electron';
console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function App() {
  const [targetPath, targetPathSet] = useState("");
  const [folders, foldersSet] = useState<string[]>([]);
  const onGetTargetFilePath: React.DOMAttributes<HTMLInputElement>["onDrag"] = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const items = e.dataTransfer.items;
    if (!items.length) return;
    
    if (items[0].kind === "file" && !items[0]?.webkitGetAsEntry()?.isFile) {
      const pathFile = items[0]?.getAsFile()?.path || ""; //文件路径
      console.log(items[0]);
      targetPathSet(pathFile);
    }
   
  };
  const onGetSourceFiles: React.DOMAttributes<HTMLInputElement>["onDrag"] = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const items = e.dataTransfer.items;
    if (!items.length) return;
    const foldersList:string[]=[]
    for (let folder of items){
      if (folder.kind === "file" && !folder?.webkitGetAsEntry()?.isFile) {
        const pathFile = folder?.getAsFile()?.path || "";
        foldersList.push(pathFile)
      }
    }
    foldersSet(foldersList)
   
  };
  const start=()=>{
    ipcRenderer.send('start', targetPath, folders)
  }
  useEffect(()=>{
    const handle = () => {
      ipcRenderer.send('alert', "提示", "转换完成")
    }
    ipcRenderer.on("ok", handle)
    return ()=>{
      ipcRenderer.removeListener('ok', handle)
    }
  },[])
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
          onDrop={onGetTargetFilePath}
        />
        <button onClick={start}>转换</button>
      </div>
      <div className="darg-box" onDragOver={(e) => e.preventDefault()} onDrop={onGetSourceFiles}>
        {folders?.length ? folders.join("\n") :'拖入1x2|2x1|2x2文件夹'}
      </div>
    </div>
  );
}

export default App;
