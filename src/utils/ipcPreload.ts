/** 应用预加载设置脚本 */
const { ipcRenderer } = require('electron')
const { contextBridge } = require('electron/renderer')

const myPrompt = (message?: string | undefined, _default?: string | undefined) => {
    // 进程间通信：同步方法调用
    return ipcRenderer.sendSync('window-prompt', message, _default)
}
const printStr = (str: string) => {
    console.log(str)
}
/** 
 * 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境
 * 重置window.prompt
 *  
 * */
// window.prompt = myPrompt as any  // 直接设置失败
/** 
 * 暴露主进程对象
 * 覆盖window.prompt方法（只能在应用环境中用myPromp替换window.prompt使用）
 *  */
contextBridge.exposeInMainWorld('myPrompt', myPrompt)
// contextBridge.exposeInIsolatedWorld(1004, 'printStr', printStr)

contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息通知，期望异步的结果（.send方法不接收回传）
  loadPreferences: (content: string) => ipcRenderer.invoke('load-prefs', content)
})

/** 这里跟应用windo不是同一个，跟谷歌插件环境类似，有沙箱隔离 */
console.info('here ipcPreload.ts: window', window)

/** 
 * 访问process、document
 * 
 * 监听window事件有效
 *  */
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text?: string) => {
    /** 可以访问document */
    const element = document.getElementById(selector)
    if (element && text) {
      element.innerText = text
    }
  }
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
/** 以下设置无效（上下文隔离，如果需要绑定到window对象上，需要使用contextBridge提供的工具函数） */
window.testStr = 'hello world!'
window.testFn = (text: string) => console.log(text)
window.testObj = {
  a: 123,
  b: [
    {c: new Map()}
  ]
}