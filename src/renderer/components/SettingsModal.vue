<template>
    <Modal :value="settingsModal"
         v-bind:title="$t('m.settings.title')"
         :closable="false"
         :mask-closable="false">
    
    <Row>
      <h3 style="margin-bottom:5px;">{{$t("m.settings.langTitle")}}</h3>
      <Select v-model="curLocale"
              @on-change="changeLang"
              style="width:200px">
        <Option v-for="item in langList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </Row>

    <div slot="footer">
      <Button type="text" size="large" @click="closeSettingsModal">{{$t("m.settings.close")}}</Button>
      <Button type="primary" size="large" @click="submitSettings">{{$t("m.settings.save")}}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ["locale", "settingsModal"],

  data() {
    return {
      curLocale: this.locale,
      langList: [
        { value: "en-US", label: "English" },
        { value: "zh-CN", label: "简体中文" }
      ]
    };
  },

  watch: {
    locale: function() {
      this.curLocale = this.locale;
    }
  },

  methods: {
    submitSettings() {
      this.$emit("submitSettings", this.curLocale);
    },
    closeSettingsModal() {
      this.curLocale = this.locale;
      this.$emit("closeSettingsModal");
    },
    changeLang(value) {
      this.curLocale = value;
    }
  }
};
</script>

<style>

</style>