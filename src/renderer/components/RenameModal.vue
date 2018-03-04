<template>
    <Modal :value="renameModal"
         v-bind:title="$t('m.modal.rename.title')"
         :closable="false"
         :mask-closable="false">
    <Input v-model="newContent"
           v-bind:placeholder="$t('m.modal.rename.placeholder')"
           autofocus
           icon="edit"
    />
    <div slot="footer">
      <Button type="text" size="large" @click="closeRenameModal">{{$t("m.modal.rename.cancel")}}</Button>
      <Button type="primary" size="large" @click="submitRename">{{$t("m.modal.rename.ok")}}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ["oldContent", "renameModal"],

  data() {
    return {
      newContent: this.oldContent
    };
  },

  watch: {
    oldContent: function() {
      this.newContent = this.oldContent;
    }
  },

  methods: {
    submitRename() {
      if (this.newContent.trim() === "") {
        return false;
      }
      this.$emit("submitRename", this.newContent);
    },
    closeRenameModal() {
      this.$emit("closeRenameModal");
    }
  }
};
</script>

<style>

</style>