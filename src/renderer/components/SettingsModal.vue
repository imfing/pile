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
          <Input v-model="board.label" style="width: 200px" size="small" @on-blur="saveBoards"/>
        </div>
      </draggable> 
    </div>

    <div class="separator"></div>

    <div>
      <span style="color:#bbbec4;">
        v{{require('electron').remote.app.getVersion()}}
      </span>
    </div>

    <div slot="footer">
      <Button type="text" size="large" @click="closeSettingsModal">{{$t("m.settings.close")}}</Button>
      <Button type="primary" size="large" @click="submitSettings">{{$t("m.settings.save")}}</Button>
    </div>
  </Modal>
</template>

<script>
import draggable from "vuedraggable";

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
      boardsLocal: null
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
      this.$emit("closeSettingsModal");
    },
    changeLang(value) {
      this.curLocale = value;
    },
    saveBoards() {
      // console.log(this.boardsLocal)
    },
    updateLocalBoards() {
      this.boardsLocal = JSON.parse(JSON.stringify(this.boards));
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