/** 应用预加载设置脚本 */
const { ipcRenderer } = require('electron')
const { contextBridge } = require('electron/renderer')

const myPrompt = (message?: string | undefined, _default?: string | undefined) => {
    // 进程间通信：同步方法调用
    return ipcRenderer.sendSync('window-prompt', message, _default)
}
/** 
 * 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境
 * 重置window.prompt
 *  
 * */
// window.prompt = myPrompt as any  // 直接设置失败
/** 覆盖window.prompt方法（只能在应用环境中用myPromp替换window.prompt使用） */
contextBridge.exposeInMainWorld('myPrompt', myPrompt)

/** 这里跟应用windo不是同一个，跟谷歌插件环境类似，有沙箱隔离 */
console.info('here ipcPreload.ts: window', window)