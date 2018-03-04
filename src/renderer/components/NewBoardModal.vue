<template>
    <Modal :value="newBoardModal"
         v-bind:title="$t('m.board.new.title')"
         :closable="false"
         :mask-closable="false">
    <Input v-model="newBoardName"
           v-bind:placeholder="$t('m.board.new.placeholder')"
           @on-keyup.enter="submitNewBoard"
           autofocus
    />
    <div slot="footer">
      <Button type="text" size="large" @click="closeNewBoardModal">{{$t("m.board.new.cancel")}}</Button>
      <Button type="primary" size="large" @click="submitNewBoard">{{$t("m.board.new.confirm")}}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ['newBoardModal'],
  data () {
    return {
      newBoardName: ''
    }
  },
  methods: {
    submitNewBoard () {
      if (this.newBoardName.trim() === '') {
        this.newBoardName = ''
        return false
      }
      this.$emit('submitNewBoard', this.newBoardName)
      this.newBoardName = ''
    },
    closeNewBoardModal () {
      this.$emit('closeNewBoardModal')
      this.newBoardName = ''
    }
  }

}
</script>

<style>


</style>
