<template>
    <Modal :value="renameHubModal"
         v-bind:title="$t('m.modal.rename.title')"
         :closable="false"
         :mask-closable="false">
    <Input v-model="newHubName"
           v-bind:placeholder="$t('m.modal.rename.placeholder')"
           clearable
           autofocus
           @on-keyup.enter="submitHubName"
    />
    <div slot="footer">
      <Button type="text" size="large" @click="closeRenameHubModal">{{$t("m.modal.rename.cancel")}}</Button>
      <Button type="primary" size="large" @click="submitHubName">{{$t("m.modal.rename.ok")}}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ["originalName", "renameHubModal"],

  data() {
    return {
      newHubName: this.originalName
    };
  },

  watch: {
    originalName: function() {
      this.newHubName = this.originalName;
    }
  },

  methods: {
    submitHubName() {
      if (this.newHubName.trim() === "") {
        return false;
      }
      this.$emit("submitHubName", this.newHubName);
    },
    closeRenameHubModal() {
      this.$emit("closeRenameHubModal");
    }
  }
};
</script>

<style>

</style>