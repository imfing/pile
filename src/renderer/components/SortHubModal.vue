<template>
  <Modal :value="sortHubModal"
        v-bind:title="$t('m.modal.sort.title')"
        :closable="false"
        :mask-closable="false">

    <div>
      <draggable :list="hubsLocal">
        <div v-for="hub in hubsLocal"
             :key="hub.id">
          <Icon type="drag" size=10></Icon>
          <Input v-model="hub.label" style="width: 200px" size="small"/>
        </div>
      </draggable>
    </div>

    <div slot="footer">
      <Button type="text" size="large" @click="closeSortHubModal">{{$t("m.modal.sort.cancel")}}</Button>
      <Button type="primary" size="large" @click="submitSortHubs">{{$t("m.modal.sort.ok")}}</Button>
    </div>

  </Modal>
</template>

<script>
import draggable from "vuedraggable";

export default {
  props: ["sortHubModal", "hubs"],

  components: {
    draggable
  },

  created() {
    this.updateLocalHubs();
  },

  data() {
    return {
      hubsLocal: null
    }
  },

  watch: {
    hubs: function() {
      this.updateLocalHubs();
    }
  },

  methods: {
    updateLocalHubs() {
      this.hubsLocal = JSON.parse(JSON.stringify(this.hubs));
    },
    submitSortHubs() {
      this.$emit("submitSortHubs", this.hubsLocal);
    },
    closeSortHubModal() {
      this.updateLocalHubs();
      this.$emit("closeSortHubModal");
    }
  }
}
</script>
