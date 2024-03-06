/**
 * 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力
 */
const { app, BrowserWindow } = require('electron')
// 加载进一个新的BrowserWindow实例
const createWindow = () => {
    // BrowserWindow 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadFile('index.html')
}
const createWindow_remote = () => {
    // BrowserWindow 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页
    const win = new BrowserWindow({
        width: 960,
        height: 600
    })
    win.loadURL('https://www.electronjs.org/zh/docs/latest/tutorial/process-model')
    win.on('resize', event => {
        console.log('here resize handle', event, contents)
    })
    const contents = win.webContents
    // 打开Chromium的开发者工具集
    contents.openDevTools()
    console.log(contents)
}
// 在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
    // createWindow()
    createWindow_remote()
    // 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})
// 关闭所有窗口时退出应用 (Windows & Linux)
app.on('window-all-closed', () => {
    // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})