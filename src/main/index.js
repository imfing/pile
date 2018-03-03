import { app, BrowserWindow } from 'electron'

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
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Need to import vue first :(
import Vue from 'vue';
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
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
        click () { require('electron').shell.openExternal('https://github.com/mtobeiyf/pile') }
      }
    ]
  }
]
var menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu);

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
