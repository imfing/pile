import { app, BrowserWindow } from 'electron'
import settingsStore from "../renderer/store/modules/settingsStore"

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  // const windowConfig = settingsStore.getWindowState()
  const path = require('path')
  // windowConfig.icon = path.join(__dirname, '/assets/pile.ico')
  // mainWindow = new BrowserWindow(windowConfig)
  mainWindow = new BrowserWindow({icon: path.join(__dirname, '/assets/pile.ico')})

  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // mainWindow.on('resize', () => saveWindowState(mainWindow))
  // mainWindow.on('move', () => saveWindowState(mainWindow))
  // mainWindow.on('close', () => saveWindowState(mainWindow))
}

app.on('ready', createWindow)

// Need to import vue first :(
import Vue from 'vue';
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

app.on('ready', function () {
  var i18n = new VueI18n({
    locale: getLocale(),    // 语言标识
    messages: {
      'zh-CN': require('../renderer/lang/zh'),   // 中文语言包
      'en-US': require('../renderer/lang/en')    // 英文语言包
    }
  })

  const Menu = require('electron').Menu;
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
          role: 'close'
        }
      ]
    },
    {
      label: i18n.t("m.menu.help"),
      submenu: [
        {
          label: i18n.t("m.menu.about"),
          click() { require('electron').shell.openExternal('https://github.com/mtobeiyf/pile') }
        }
      ]
    }
  ]
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function saveWindowState(mainWindow) {
  settingsStore.updateWindowState(mainWindow.getBounds())
}

function getLocale() {
  if (settingsStore.getLocale().length == 0) {
    if (app.getLocale() == "zh-CN") {
      // settingsStore.updateLocale(app.getLocale())
      return "zh-CN"
    }
    else {
      // settingsStore.updateLocale("en-US")
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
