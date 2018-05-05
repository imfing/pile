<template>
  <Modal :value="settingsModal"
         v-bind:title="$t('m.settings.title')"
         :closable="false"
         :mask-closable="false">

    <div>
      <h3>{{$t("m.settings.langTitle")}}</h3>
      <Select v-model="curLocale"
              @on-change="changeLang"
              style="width:200px">
        <Option v-for="item in langList"
                :value="item.value"
                :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>

    <div class="separator"></div>

    <div>
      <h3>{{$t("m.settings.boardsEdit")}}</h3>
      <draggable :list="boardsLocal"
                 :options="{animation:150}">
        <div v-for="board in boardsLocal"
             class="board"
             :key="board.id">
          <Icon type="drag"
                size=10></Icon>
          <Input v-model="board.label"
                 style="width: 200px"
                 size="small" />
        </div>
      </draggable>
    </div>

    <div class="separator"></div>

    <div>
      <div class="arrow-title"
           @click="toggleAdvanced">
        <h3>
          <div class="arrow_box"
               :class="{'arrow_box--open':showAdvanced}"></div>
          {{$t("m.settings.advanced.title")}}
        </h3>
      </div>
      <transition v-on:enter="enter"
                  v-on:leave="leave">
        <div v-show="showAdvanced">
          <div class="advanced-row">
            <span style="font-weight:bold;">
              {{$t("m.settings.advanced.storage.title") + ': '}}
            </span>
            <span>
              {{dataPath}}
            </span>
            <Tooltip>
              <Button type="text"
                      @click="selectDataPath"
                      size="small"
                      icon="edit">
              </Button>
              <div slot="content">
                {{$t('m.settings.advanced.storage.change')}}
              </div>
            </Tooltip>
            <Tooltip>
              <Button type="text"
                      @click="resetDataPath"
                      size="small"
                      icon="refresh">
              </Button>
              <div slot="content">
                {{$t('m.settings.advanced.storage.reset')}}
              </div>
            </Tooltip>
            <Tooltip>
              <Button type="text"
                      @click="openDataPath"
                      size="small"
                      icon="android-open">
              </Button>
              <div slot="content">
                {{$t('m.settings.advanced.storage.open')}}
              </div>
            </Tooltip>
          </div>
        </div>
      </transition>
    </div>

    <div class="separator"></div>

    <div>
      <p style="color:#bbbec4; margin-bottom:5px;">
        {{$t("m.settings.update.current")}}: {{require('electron').remote.app.getVersion()}}
      </p>
      <Button type="ghost"
              icon="loop"
              v-if="!newVersionAvailable"
              :loading="loadingUpdates"
              @click="checkUpdate">
        <span v-if="!loadingUpdates">{{$t("m.settings.update.check")}}</span>
        <span v-else>{{$t("m.settings.update.check")}}</span>
      </Button>
      <Button type="success"
              icon="checkmark"
              v-if="newVersionAvailable"
              @click="gotoUpdate">
        {{$t("m.settings.update.newFound")}}
      </Button>
    </div>

    <div slot="footer">
      <Button type="text"
              size="large"
              @click="closeSettingsModal">{{$t("m.settings.close")}}</Button>
      <Button type="primary"
              size="large"
              @click="submitSettings">{{$t("m.settings.save")}}</Button>
    </div>
  </Modal>
</template>

<script>
import draggable from "vuedraggable";
import axios from "axios";
import Velocity from "velocity-animate";
const { remote, shell } = require("electron");

export default {
  props: ["locale", "settingsModal", "boards"],

  components: {
    draggable
  },

  created() {
    this.updateLocalBoards();
  },

  data() {
    return {
      curLocale: this.locale,
      langList: [
        { value: "en-US", label: "English" },
        { value: "zh-CN", label: "简体中文" }
      ],
      boardsLocal: null,
      newVersionAvailable: false,
      currentVersion: remote.app.getVersion(),
      loadingUpdates: false,
      showAdvanced: false,
      dataPath: remote.getGlobal("settings").userDataPath
    };
  },

  watch: {
    locale: function() {
      this.curLocale = this.locale;
    },
    boards: function() {
      this.updateLocalBoards();
    }
  },

  methods: {
    submitSettings() {
      this.changeDataPath(this.dataPath);
      this.$emit("submitSettings", this.curLocale, this.boardsLocal);
    },
    closeSettingsModal() {
      this.curLocale = this.locale;
      this.updateLocalBoards();
      this.loadingUpdates = false;
      this.dataPath = remote.getGlobal("settings").userDataPath;
      this.$emit("closeSettingsModal");
    },
    changeLang(value) {
      this.curLocale = value;
    },
    updateLocalBoards() {
      this.boardsLocal = JSON.parse(JSON.stringify(this.boards));
    },
    // Advanced
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
    enter: function(el, done) {
      // entering animation
      Velocity(
        el,
        "slideDown",
        {
          duration: 300,
          easing: "easeInBack"
        },
        { complete: done }
      );
    },
    leave: function(el, done) {
      // leaving animation
      Velocity(
        el,
        "slideUp",
        {
          duration: 300,
          easing: "easeInBack"
        },
        { complete: done }
      );
    },
    // Update
    checkUpdate() {
      this.loadingUpdates = true;
      // console.log(`${this.currentVersion}`);
      axios
        .get("https://api.github.com/repos/mtobeiyf/pile/releases/latest")
        .then(({ data }) => {
          if (`v${this.currentVersion}` === data.tag_name) {
            this.$Message.info(this.$i18n.t("m.settings.update.notFound"));
          } else {
            this.newVersionAvailable = true;
          }
        })
        .finally(() => {
          this.loadingUpdates = false;
        });
    },
    gotoUpdate() {
      require("electron").shell.openExternal(
        "https://github.com/mtobeiyf/pile/releases"
      );
    },
    selectDataPath() {
      const newPath = remote.dialog.showOpenDialog({
        properties: ["openDirectory"]
      });
      if (newPath != undefined) {
        this.dataPath = require("path").join(newPath[0], "db.json");
        this.changeDataPath(this.dataPath);
      }
    },
    resetDataPath() {
      this.dataPath = this.getDefaultPath();
    },
    getDefaultPath() {
      if (process.env.NODE_ENV !== "development")
        return require("path").join(remote.app.getPath("userData"), "db.json");
      else return "db.json";
    },
    changeDataPath(newPath) {
      if (newPath !== this.getDefaultPath) {
        remote.getGlobal("settings").userDataPath = newPath;
        this.$emit("changeDataPath", newPath);
      }
    },
    openDataPath() {
      shell.showItemInFolder(
        remote.getGlobal("settings").userDataPath
      );
    }
  }
};
</script>

<style>
h3 {
  margin-bottom: 5px;
}

.separator {
  border-bottom: 1px solid #f5f5f5;
  margin: 15px 0;
}

/* Arrow title*/
.arrow-title {
  cursor: pointer;
}

.arrow_box {
  width: 10px;
  height: 10px;
  transition: all 0.3s;
  display: inline-block;
}

.arrow_box:after,
.arrow_box:before {
  border: solid transparent;
  content: " ";
  position: absolute;
}

.arrow_box:after {
  border-width: 5px;
}
.arrow_box:before {
  border-left-color: #000;
  border-width: 5px;
}

.arrow_box--open {
  transform: rotateZ(90deg);
  transform-origin: 50% 50%;
}

.advanced-row {
  margin-bottom: 5px;
}
</style>