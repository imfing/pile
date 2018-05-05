export const m = {
  pile: 'Pile',
  menu: {
    view: "视图",
    reload: "重新加载",
    help: "帮助",
    feedback: '反馈建议',    
    about: "关于",
    devtool: "开发者工具",
    close: "退出",
    edit: {
      label: "编辑",
      undo: "撤销",
      redo: "恢复",
      cut: "剪切",
      copy: "复制",
      paste: "粘贴",
      selectall: "全选"
    }
  },
  tray: {
    show: '显示',
    quit: '退出',
    autoStart: '开机启动'
  },
  settings: {
    tip: '打开设置',
    title: '设置',
    save: '保存',
    close: '关闭',
    langTitle: '界面语言',
    boardsEdit: '标签页编辑',
    advanced: {
      title: '高级设置',
      tip: '谨慎修改此部分设置',
      storage: {
        open: '打开存储位置',
        title: '存储位置',
        change: '更改位置',
        reset: '重置'
      }
    },
    update: {
      current: '当前版本',
      check: '检查更新',
      loading: '检查中...',
      notFound: '已经是最新版',      
      newFound: '立即更新'      
    },
    success: '设置已保存'
  },
  action: {
    rename: '重命名',
    delete: '删除',
    edit: '编辑',
    openFolder: '打开文件夹'
  },
  board: {
    default: '工作区',
    lastBoard: '你需要至少保留一个标签',
    pinTip: '固定该标签到桌面',
    pinOK: '成功发送到桌面快捷方式',
    sortTip: '调整区域',
    sortOK: '调整完成',
    new: {
      tip: '添加新标签页',
      title: '添加新标签页',
      placeholder: '输入标签页名称',
      confirm: '添加',
      cancel: '取消',
      success: '标签添加成功'
    }
  },
  info: {
    emptyHub: '向此处拖拽来添加文件/程序/快捷方式等，即可在此处快速访问',
    noHubs: '空空如也，使用上方新建按钮来添加一些区域吧~',
    lnkError: '该快捷方式有误，请拖拽源文件',
    urlError: '无效URL，请确保以"http(s)"开头'
  },
  todo: {
    todo: '待办',
    done: '完成',
    hint: '输入新的待办...'
  },
  note: {
    placeholder: '可以输入文字笔记/网页链接，支持Markdown'
  },
  newHub: {
    button: '新建区域',
    item: '应用/文件',
    note: '笔记',
    todo: '待办'
  },
  modal: {
    rename: {
      title: '重命名',
      content: '重命名',
      placeholder: '输入新名称...',
      ok: '重命名',
      cancel: '取消',
      success: {
        hub: '区域重命名成功',
        item: '修改成功'
      }
    },
    delete: {
      title: '删除',
      content: '你确定删除',
      ok: '删除',
      cancel: '取消',
      success:{
        board: '标签页删除成功',
        hub: '区域删除成功'
      }
    },
    edit: {
      title: '编辑',
      placeholder: '在此输入',
      ok: '保存',
      cancel: '取消',
      success: {
        note: '编辑已保存'
      }
    },
    sort: {
      title: '调整区域',
      ok: '保存',
      cancel: '取消',
      success: '调整成功'      
    }
  }
}