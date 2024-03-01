const { app, BrowserWindow } = require('electron')
// 加载进一个新的BrowserWindow实例
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadFile('index.html')
}
// 在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(() => {
    createWindow()
})
// 关闭所有窗口时退出应用 (Windows & Linux)
app.on('window-all-closed', () => {
    // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})