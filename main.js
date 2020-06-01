// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const electron = require('electron');
const { existsSync,readFileSync, fs } = require('fs') // used to read files
const { ipcMain } = require('electron') // used to communicate asynchronously from the main process to renderer processes.
const rootPath = require('electron-root-path').rootPath;
const configDir =  (electron.app || electron.remote.app).getPath('userData');

if (!existsSync(configDir+"\\config.json")) {
  console.log("write config")
  require('fs').writeFileSync(configDir+"\\config.json", '{"action":[]}')
}

function readConfig () {
  const data = readFileSync(configDir+"\\config.json", 'utf8')
  return data
}
ipcMain.on('config_init', (event, arg) => {
  console.log(arg)
  event.returnValue = readConfig()
})


ipcMain.on('sync_devices', (event, arg) => {
  event.returnValue = "1"
  stt = 1
})
var stt = 0;
ipcMain.on('connecok', (event, arg) => {  
  event.returnValue = stt
})

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    resizable: true,
    icon: __dirname + '/icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

 mainWindow.setMenu(null);
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}


app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
 
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.