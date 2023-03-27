import { useEffect, useState } from "react";
import finedFIles from "./file"
import "./App.scss";
import { contextBridge, ipcRenderer, Notification } from 'electron';
console.log(
  "[App.tsx]",
  `Hello world from Electron ${process.versions.electron}!`
);

function App() {
  const [targetPath, targetPathSet] = useState("");
  const [name, nameSet] = useState("未开始");
  const [progress, progressSet] = useState(0);
  const [fangda, fangdaSet] = useState<any>('3');
  const [yuanjiao, yuanjiaoSet] = useState<any>('22');
  const [mohu, mohuSet] = useState<any>('30');
  const [hei, heiSet] = useState<any>('0.3');
  const [jyyj, jyyjSet] = useState<any>(true);



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
    const foldersList: string[] = []
    for (let folder of items) {
      if (folder.kind === "file" && !folder?.webkitGetAsEntry()?.isFile) {
        const pathFile = folder?.getAsFile()?.path || "";
        foldersList.push(pathFile)
      }
    }
    const map={
      "1x2":1,
      "2x1":2,
      "2x2":3,
    } as any
    console.log(foldersList.sort((a, b) => {
     
      const A = (a || '')?.match(/\dx\d/)?.[0]||'';
      const B = (b || '')?.match(/\dx\d/)?.[0]||'';
   
      return (map[A]||0)-(map[B]||1)
    }))
    foldersSet(foldersList)

  };
  const get40files: React.DOMAttributes<HTMLInputElement>["onDrag"] = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const items = e.dataTransfer.items;
    if (!items.length) return;
    const foldersList: string[] = []
    for (let folder of items) {
      if (folder.kind === "file" && !folder?.webkitGetAsEntry()?.isFile) {
        const pathFile = folder?.getAsFile()?.path || "";

        ipcRenderer.send('move', finedFIles, pathFile)

      }
    }
  };
  const start = () => {
    progressSet(0);
    nameSet("");
    ipcRenderer.send('start', targetPath, folders, {
      fangda: parseFloat(fangda || 3),
      mohu: parseFloat(mohu || 30),
      hei: parseFloat(hei || '0.3'),
      jyyj: jyyj,
      yuanjiao: parseFloat(yuanjiao || '22'),
    })
  }
  useEffect(() => {
    const handle = () => {
      ipcRenderer.send('alert', "提示", "转换完成")
      progressSet(100);
      nameSet("转换完成");
    }
    const moveok = () => {
      console.log('move')
      ipcRenderer.send('alert', "提示", "移动完成")
    }
    const handleProgress = (enevt: any, num: any, name: any) => {
      nameSet(name);
      progressSet(num * 100);
    };
    ipcRenderer.on("ok", handle)
    ipcRenderer.on("progress", handleProgress);
    ipcRenderer.on("moveok", moveok);
    return () => {
      ipcRenderer.removeListener('ok', handle)
      ipcRenderer.removeListener("progress", handleProgress);
      ipcRenderer.removeListener("moveok", moveok);
    }
  }, [])
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
      <div className="flex-row al-c" style={{ marginTop: 20 }}>
        放大倍数(最低1):
        <input
          value={fangda}
          onChange={v => fangdaSet(v.target.value)}
          type="text"
          placeholder="放大倍数"
          style={{ width: "280px", }}
        />
      </div>
      <div className="flex-row al-c" style={{ marginTop: 20 }}>
        模糊倍数0-1000:
        <input
          value={mohu}
          onChange={v => mohuSet(v.target.value)}
          type="text"
          placeholder="模糊倍数0-1000"
          style={{ width: "280px", }}
        />
      </div>
      <div className="flex-row al-c" style={{ marginTop: 20 }}>
        黑色倍数0-1:
        <input
          value={hei}
          onChange={v => heiSet(v.target.value)}
          type="text"
          placeholder="黑色倍数0-1"
          style={{ width: "280px", }}
        />
      </div>


      <br />
      <div className="flex-row al-c" style={{ marginTop: 20, height: 30 }}>
        禁用圆角:<input type="checkbox" checked={jyyj} onChange={v => {
          console.log(v.target.checked)
          jyyjSet(v.target.checked)


        }} />
        {!jyyj && <input value={yuanjiao} onChange={v => yuanjiaoSet(v.target.value)}></input>}
      </div>
      <div className="darg-box" onDragOver={(e) => e.preventDefault()} onDrop={onGetSourceFiles}>
        {folders?.length ? folders.join("\n") : '拖入1x2|2x1|2x2文件夹'}
      </div>
      <div className="progress">
        <div className="p-content" style={{ width: progress + '%' }}></div>
      </div>
      <div className="currt-name">
        {name}
      </div>
      <div className="darg-box" onDragOver={(e) => e.preventDefault()} onDrop={get40files}>

      </div>
    </div>
  );
}

export default App;
