<template>
    <Modal :value="settingsModal"
         v-bind:title="$t('m.settings.title')"
         :closable="false"
         :mask-closable="false">
    
    <div>
      <h3 style="margin-bottom:5px;">{{$t("m.settings.langTitle")}}</h3>
      <Select v-model="curLocale"
              @on-change="changeLang"
              style="width:200px">
        <Option v-for="item in langList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </div>

    <div class="separator"></div>

    <div>
      <h3 style="margin-bottom:5px;">{{$t("m.settings.boardsEdit")}}</h3>
      <draggable :list="boardsLocal">
        <div v-for="board in boardsLocal" class="board" :key="board.id">
          <Icon type="drag" size=10></Icon>
          <Input v-model="board.label" style="width: 200px" size="small"/>
        </div>
      </draggable> 
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
      <Button type="text" size="large" @click="closeSettingsModal">{{$t("m.settings.close")}}</Button>
      <Button type="primary" size="large" @click="submitSettings">{{$t("m.settings.save")}}</Button>
    </div>
  </Modal>
</template>

<script>
import draggable from "vuedraggable";
import axios from "axios";
const { remote } = require("electron");

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
      loadingUpdates: false
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
      this.$emit("submitSettings", this.curLocale, this.boardsLocal);
    },
    closeSettingsModal() {
      this.curLocale = this.locale;
      this.updateLocalBoards();
      this.loadingUpdates = false;
      this.$emit("closeSettingsModal");
    },
    changeLang(value) {
      this.curLocale = value;
    },
    updateLocalBoards() {
      this.boardsLocal = JSON.parse(JSON.stringify(this.boards));
    },
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
    }
  }
};
</script>

<style>
.separator {
  border-bottom: 1px solid #f5f5f5;
  margin: 15px 0;
}
</style>