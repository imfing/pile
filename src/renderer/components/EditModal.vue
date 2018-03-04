<template>
    <Modal :value="editModal"
         v-bind:title="$t('m.modal.edit.title')"
         :closable="false"
         :mask-closable="false">
    <Input v-model="newContent"
           v-bind:placeholder="$t('m.modal.edit.placeholder')"
           autofocus
           type="textarea"
           :autosize="true"
    />
    <div slot="footer">
      <Button type="text" size="large" @click="closeEditModal">{{$t("m.modal.edit.cancel")}}</Button>
      <Button type="primary" size="large" @click="submitEdit">{{$t("m.modal.edit.ok")}}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ["oldContent", "editModal"],

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
    submitEdit() {
      if (this.newContent.trim() === "") {
        return false;
      }
      this.$emit("submitEdit", this.newContent);
    },
    closeEditModal() {
      this.$emit("closeEditModal");
    }
  }
};
</script>

<style>

</style>