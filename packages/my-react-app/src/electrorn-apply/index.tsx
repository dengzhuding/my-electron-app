import { useState } from "react";

function ElectronApply() {
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState(document.title);

  const btnClickHandle: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    console.log("here btn click handle:", event);
    if (!window.isolatedShare) {
      return;
    }
    window.isolatedShare.setTitle(title);
  };

  const openShowOpenDialog = async () => {
    console.log("here btn click handle - openShowOpenDialog:");
    if (!window.isolatedShare) {
      return;
    }
    const res = await window.isolatedShare.getFileChoosePath();
    const input = document.querySelector("#filePathInput") as HTMLInputElement;
    if (input && res) {
      if (res.canceled) {
        input.value = "";
      } else {
        const path = Array.isArray(res.filePaths) ? res.filePaths[0] || "" : "";
        input.value = path;
      }
    }
  };

  return (
    <>
      <div className="max-w-80 min-w-60 self-center fixed right-0 bottom-0 bg-white bg-opacity-80 p-2">
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <div className="flex flex-col items-stretch mb-6">
          {/* 设置窗口标题 */}
          <p className="">title: {title}</p>
          <input
            className="my-3 border hover:border-violet-300"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button
            className="border-violet-500 bg-violet-500 hover:bg-violet-800 text-white p-1"
            onClick={btnClickHandle}
          >
            set title
          </button>
        </div>
        <div className="flex flex-col items-stretch mb-6">
          {/* 打开一个原生的文件对话框 */}
          <p className="self-start">File Path:</p>
          <textarea
            className="my-3 border hover:border-violet-300"
            id={"filePathInput"}
            disabled
          />
          <button
            className="border-violet-500 bg-violet-500 hover:bg-violet-800 text-white p-1"
            onClick={openShowOpenDialog}
          >
            选择文件
          </button>
        </div>
      </div>
    </>
  );
}

export default ElectronApply;
