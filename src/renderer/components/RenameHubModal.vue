<template>
    <Modal :value="renameHubModal"
         title="Rename Hub"
         okText="Rename"
         :closable="false"
         :mask-closable="false"
         cancelText="Cancel">
    <Input v-model="newHubName"
           placeholder="New name..."
           clearable
           autofocus
           @on-keyup.enter="submitHubName"
    />
    <div slot="footer">
      <Button type="text" size="large" @click="closeRenameHubModal">Cancel</Button>
      <Button type="primary" size="large" @click="submitHubName">Rename</Button>
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
  methods: {
    submitHubName() {
      if (this.newHubName.trim() === "") {
        this.newHubName = "";
        return false;
      }
      this.$emit("submitHubName", this.newHubName);
      this.newHubName = "";
    },
    closeRenameHubModal(){
      this.$emit("closeRenameHubModal");
      this.newHubName = "";
    }
  }
};
</script>

<style>

</style>