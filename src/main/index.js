import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron'
import configStore from "./configStore"

const path = require('path')
const fs = require('fs')

// Load settings and data
var configPath, dataPath, customStylePath
if (process.env.NODE_ENV !== 'development') {
  // Set to avoid error at first launch
  if (!fs.existsSync(app.getPath('userData'))) {
    fs.mkdirSync(app.getPath('userData'))
  }
  configPath = path.join(app.getPath('userData'), 'settings.json')
  dataPath = path.join(app.getPath('userData'), 'db.json')
  customStylePath = path.join(app.getPath('userData'), 'style.less')
}
else {
  // Data under developing
  configPath = 'settings.json'
  dataPath = 'db.json'
  customStylePath = 'style.less'
}

// AppSettings
const appSettings = configStore(configPath)

global.settings = {}

// Load paths
global.settings.userDataPath = appSettings.getDataPath()
global.settings.userStylePath = customStylePath

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray = null

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.exit()
}

function createWindow() {
  /**
   * Initial window options
   */
  const windowConfig = appSettings.getWindowState()

  if (process.platform === 'win32') {
    windowConfig.icon = path.join(__static, 'icons/pile.ico')
  }
  else {
    windowConfig.icon = path.join(__static, 'icons/pile.png')
  }

  mainWindow = new BrowserWindow(windowConfig)
  // mainWindow = new BrowserWindow({ icon: path.join(__static, 'icons/pile.ico') })

  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', function (event) {
    event.preventDefault();
    mainWindow.hide();
    return false;
  });

  mainWindow.on('resize', () => saveWindowState(mainWindow))
  mainWindow.on('move', () => saveWindowState(mainWindow))
}

app.on('ready', createWindow)

// Need to import vue first :(
import Vue from 'vue';
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

app.on('ready', function () {
  var i18n = new VueI18n({
    locale: getLocale(),
    messages: {
      'zh-CN': require('../renderer/lang/zh'),
      'en-US': require('../renderer/lang/en')
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('loadLocale', getLocale())
    // injectCustomStyle(customStylePath)
  })

  // Handle drop redirect
  var handleRedirect = (e, url) => {
    if (url != mainWindow.webContents.getURL()) {
      e.preventDefault()
      require('electron').shell.openExternal(url)
    }
  }

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)

  // Menu
  var template = [
    {
      label: i18n.t("m.menu.view"),
      submenu: [
        { label: i18n.t("m.menu.reload"), accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: i18n.t("m.menu.devtool"), accelerator: 'F12', role: 'toggledevtools'},
        { label: i18n.t("m.menu.close"), accelerator: 'CmdOrCtrl+Q',
          click() { app.exit() }
        }
      ]
    },
    {
      label: i18n.t("m.menu.edit.label"),
      submenu: [
        { label: i18n.t("m.menu.edit.undo"), accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: i18n.t("m.menu.edit.redo"), accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: i18n.t("m.menu.edit.cut"), accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: i18n.t("m.menu.edit.copy"), accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: i18n.t("m.menu.edit.paste"), accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: i18n.t("m.menu.edit.selectall"), accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    },
    {
      label: i18n.t("m.menu.help"),
      submenu: [
        {
          label: i18n.t("m.menu.feedback"),
          click() { require('electron').shell.openExternal('https://github.com/mtobeiyf/pile/issues') }
        },
        {
          label: i18n.t("m.menu.about"),
          click() { require('electron').shell.openExternal('https://github.com/mtobeiyf/pile') }
        }
      ]
    }
  ]
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  // Set tray
  var trayIcon
  if (process.platform === "darwin") {
    trayIcon = nativeImage.createFromPath(path.join(__static, 'icons/menubar.png'))
  }
  else if (process.platform === "win32") {
    trayIcon = nativeImage.createFromPath(path.join(__static, 'icons/pile.ico'))
  }
  else {
    trayIcon = nativeImage.createFromPath(path.join(__static, 'icons/pile.png'))
  }
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: i18n.t("m.tray.show"),
      click() {
        mainWindow.show()
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    },
    {
      label: i18n.t("m.tray.autoStart"),
      type: 'checkbox',
      checked: appSettings.getAutoStart(),
      click() {
        let status = contextMenu.items[1].checked
        if (status) {
          app.setLoginItemSettings({ openAtLogin: true })
        }
        else {
          app.setLoginItemSettings({ openAtLogin: false })
        }
        appSettings.updateAutoStart(status)
      }
    },
    {
      label: i18n.t("m.tray.quit"),
      click() {
        app.exit()
      }
    }
  ])
  tray.on('click', function () {
    mainWindow.show()
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })
  tray.on('double-click', function () {
    mainWindow.show()
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })
  tray.setToolTip('Pile')
  tray.setContextMenu(contextMenu)
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ipc Events

ipcMain.on('getLocale', (event, data) => {
  mainWindow.webContents.send('loadLocale', getLocale())
})

ipcMain.on('updateLocale', (event, data) => {
  appSettings.updateLocale(data)
})

ipcMain.on('changeDataPath', (event, data) => {
  appSettings.updateDatePath(data)
})

// Helper Functions

function getLocale() {
  // Get locale from setting
  if (appSettings.getLocale().length == 0) {
    if (app.getLocale() == "zh-CN") {
      appSettings.updateLocale("zh-CN")
      return "zh-CN"
    }
    else {
      appSettings.updateLocale("en-US")
      return "en-US"
    }
  }
  else {
    return appSettings.getLocale()
  }
}

function saveWindowState(mainWindow) {
  // Save the window state
  appSettings.updateWindowState(mainWindow.getBounds())
}

function injectCustomStyle(path) {
  // inject local css file
  if (fs.existsSync(path)) {
    fs.readFile(path, "utf-8", function (error, data) {
      if (!error) {
        var formatedData = data.replace(/\s{2,10}/g, ' ').trim()
        mainWindow.webContents.insertCSS(formatedData)
      }
    })
  }
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
