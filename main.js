/**
 * 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力
 */
const { app, BrowserWindow, Menu, MenuItem, session, ipcMain } = require('electron')
const path = require('node:path')
const os = require('node:os')
const { name } = require('./package.json')

/** ********************** 进程间通信的4种模式 start ********************** */
/**
 * 1. Renderer to main (one-way单向)
 *   发送：ipcRenderer.send | ipcRenderer.sendSync
 *   接收: ipcMain.on
 *  */
ipcMain.on('set-title', (event, /** @type {string} */ title) => {
    console.log('here "set-title" handle, event: ', event)
    const contents = event.sender
    const win = BrowserWindow.fromWebContents(contents)
    if (win) {
        win.setTitle(title)
    }

})


/** ********************** 进程间通信的4种模式 end ********************** */

/** 支持prompt */
const prompt = require('electron-prompt');
/**
 * @description 打开prompt窗口
 * @param {Electron.IpcMainEvent} event 
 * @param {string | undefined} title 
 * @param {string | undefined} content 
 */
const windowPrompt = async (event, title, content) => {
    console.log(`here windowPrompt fn, title:${title} - content:${content}`)
    // let window = event.sender.getOwnerBrowserWindow();
    const win = BrowserWindow.getFocusedWindow()
    return new Promise((resolve, reject) => {
        prompt({
            title: event.sender.getURL() + '：确认',
            label: title,
            value: content || '',
            buttonLabels: {
                ok: '确认',
                cancel: '取消'
            },
            type: 'input',
            inputAttrs: {
                type: 'text'
            },
            width: 500,
            height: 180
        }, win || undefined)
            .then(res => res ? resolve(res) : reject(null))
            .catch(error => reject(null))
    })

}
/** ipcRenderer.send用on监听？ */
ipcMain.on('window-prompt', async (event, /** @type {string | undefined} */ title, /** @type {string | undefined} */ content) => {
    try {
        event.returnValue = await windowPrompt(event, title, content)
    } catch (error) {
        event.returnValue = null
    }
})
/** ipcRenderer.invoke 用handle监听？ */
ipcMain.handle('load-prefs', (event, /** @type {string | undefined} */ content) => {
    console.info('here ipcMain.handle:load-prefs', event)
    return Promise.resolve(`hello ${content} !`)
})
// 开发工具拓展 on windows
const vueDevToolsPath = path.join(
    os.homedir(),
    'AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.6.1_0'
)
const reactDevToolsPath = path.join(
    os.homedir(),
    'AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.0.2_0'
)
// const vueDevToolsPath = path.join(
//     __dirname,
//     'chrome-extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.6.1_0'
// )
console.log('vueDevToolsPath: ', vueDevToolsPath)
app.name = name
app.getFileIcon('./favicon.ico')

/** 头部主菜单 */
const menu = new Menu()

/**
 * @description 创建菜单项的工厂函数
 * @param {Electron.MenuItemConstructorOptions} option 
 * @returns 
 */
const menuItemfactory = (option) => {
    return new MenuItem(option)
}

menu.append(menuItemfactory({
    label: 'Chrome DevTools',
    /**
     * 
     * @param {Electron.MenuItem} menuItem 
     * @param {Electron.BrowserWindow | undefined} browserWindow 
     * @param {Electron.KeyboardEvent} event 
     */
    click: (menuItem, browserWindow, event) => {
        console.log('here meunItem: chrome devTools - click event')
        if (browserWindow) {
            const contents = browserWindow.webContents
            // 打开Chromium的开发者工具集
            contents.isDevToolsOpened() ? contents.closeDevTools() : contents.openDevTools()
        }
    }
}))
menu.append(menuItemfactory({
    label: '刷新',
    /**
     * 
     * @param {Electron.MenuItem} menuItem 
     * @param {Electron.BrowserWindow | undefined} browserWindow 
     * @param {Electron.KeyboardEvent} event 
     */
    click: (menuItem, browserWindow, event) => {
        console.log('here meunItem: 刷新 - click event')
        if (browserWindow) {
            const contents = browserWindow.webContents
            contents.reload()
        }
    }
}))
menu.append(menuItemfactory({
    label: '本地窗口',
    /**
     * 
     * @param {Electron.MenuItem} menuItem 
     * @param {Electron.BrowserWindow | undefined} browserWindow 
     * @param {Electron.KeyboardEvent} event 
     */
    click: (menuItem, browserWindow, event) => {
        console.log('here meunItem: 本地窗口 - click event')
        createWindow()
    }
}))
app.applicationMenu = menu



// 加载进一个新的BrowserWindow实例
const createWindow = () => {
    // BrowserWindow 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, './src/utils/ipcPreload.js')
        },
    })
    win.loadFile('index.html')
    const contents = win.webContents
    // 打开Chromium的开发者工具集
    contents.openDevTools()
}
// 加载进一个新的BrowserWindow实例
const createWindow_local = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, './src/utils/ipcPreload.js')
        },
    })
    win.loadURL('http://localhost:1096/')
        .catch(error => console.warn('loadURL faild: ', error))
    const contents = win.webContents
    contents.on('did-fail-load', (event, code, des) => {
        console.log('here webContents - on(\'did-fail-load\'): ', code, des)
    })
    contents.openDevTools()
}
const createWindow_remote = () => {
    // BrowserWindow 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            /**
                预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码
                虽然预加载脚本与其所附着的渲染器在共享着一个全局 window 对象，
                但您并不能从中直接附加任何变动到 window 之上，因为 contextIsolation(上下文隔离) 是默认的
                使用 contextBridge 模块来安全地实现交互
             * 
             */
            preload: path.join(__dirname, './src/utils/ipcPreload.js')
        },

    })
    // win.loadURL('https://www.electronjs.org/zh/docs/latest/tutorial/process-model')
    win.loadURL('http://localhost:6174/index_design.html#/adap/21000061/request-prototyping-design/interfacial?productId=21000061&functionId=60fa393a-9e6f-49c0-a79b-04203e084474')

    win.on('resize', (/** @type {Function} */ event) => {
        console.log('here resize handle', event, contents)
    })
    win.webContents.on('dom-ready', () => {
        console.log('here dom-ready')
    })
    const contents = win.webContents
    // 打开Chromium的开发者工具集
    // contents.openDevTools() // 鼠标右键-菜单栏打开
    console.log(contents)
    setTimeout(() => {
        console.info('here passed 3s, and call destory.')
        // win.destroy()

    }, 3000);
}
// 在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.whenReady().then(async () => {
    /** 加载开发工具拓展 */
    await session.defaultSession.loadExtension(vueDevToolsPath)
    await session.defaultSession.loadExtension(reactDevToolsPath)

    // createWindow()
    createWindow_local()
    // createWindow_remote()
    // 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})
// 关闭所有窗口时退出应用 (Windows & Linux)
app.on('window-all-closed', () => {
    console.log('here window-all-closed handler')
    // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})