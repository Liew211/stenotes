// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, shell } = require("electron");
const path = require("path");

function createMainWindow() {
  // Create the browser window.
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;
  const win = new BrowserWindow({
    x: width/2-800,
    y: height-225,
    width: 800,
    height: 150,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"),
    },
    alwaysOnTop: true,
    backgroundColor: "#b0aaaaaa",
    frame: false,
    transparent: true,
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  win.setVisibleOnAllWorkspaces(true);
  // win.setIgnoreMouseEvents(true);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createSideWindow() {
  // Create the browser window.
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  const win = new BrowserWindow({
    x: width-325,
    y:100,
    width: 300,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preloadSummary.js"),
    },
    alwaysOnTop: true,
    backgroundColor: "#b0aaaaaa",
    frame: false,
    transparent: true,
  });

  // and load the index.html of the app.
  win.loadFile("keywords.html");

  win.setVisibleOnAllWorkspaces(true);
  // win.setIgnoreMouseEvents(true);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  win.webContents.on('will-navigate', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  });
}

try {
    require("electron-reloader")(module);
} catch (_) { }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createMainWindow();
    createSideWindow();
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
