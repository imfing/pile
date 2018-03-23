import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron'
import settingsStore from "../renderer/store/modules/settingsStore"

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray = null

const path = require('path')

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
  const windowConfig = settingsStore.getWindowState()

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

  var template = [
    {
      label: i18n.t("m.menu.view"),
      submenu: [
        {
          label: i18n.t("m.menu.reload"),
          accelerator: 'CmdOrCtrl+R',
          role: 'reload'
        },
        {
          label: i18n.t("m.menu.devtool"),
          role: 'toggledevtools'
        },
        {
          label: i18n.t("m.menu.close"),
          click() { app.exit() }
        }
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

  let trayIcon = nativeImage.createFromPath(path.join(__static, 'icons/pile.png'));
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
      checked: settingsStore.getAutoStart(),
      click() {
        let status = contextMenu.items[1].checked
        if (status) {
          app.setLoginItemSettings({ openAtLogin: true })
        }
        else {
          app.setLoginItemSettings({ openAtLogin: false })
        }
        settingsStore.updateAutoStart(status)
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

ipcMain.on('getLocale', (event, data) => {
  mainWindow.webContents.send('loadLocale', getLocale())
})

ipcMain.on('updateLocale', (event, data) => {
  settingsStore.updateLocale(data)
})

function saveWindowState(mainWindow) {
  settingsStore.updateWindowState(mainWindow.getBounds())
}

function getLocale() {
  if (settingsStore.getLocale().length == 0) {
    if (app.getLocale() == "zh-CN") {
      settingsStore.updateLocale("zh-CN")
      return "zh-CN"
    }
    else {
      settingsStore.updateLocale("en-US")
      return "en-US"
    }
  }
  else {
    return settingsStore.getLocale()
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
