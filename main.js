const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 950,
        height: 600,
        alwaysOnTop: true,
        backgroundColor: '#88aaaaaa',
        // opacity:0.1,
        webPreferences: {
            nodeIntegration: true
        },
        // frame: false,
        transparent: true

    })

    win.loadFile('index.html')
    win.setVisibleOnAllWorkspaces(true)
    // win.setIgnoreMouseEvents(true)

}
try {
    require('electron-reloader')(module)
} catch (_) { }

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
