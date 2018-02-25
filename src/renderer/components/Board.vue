<template>
  <div class="tab-content">
    <div v-if="isBoardEmpty" class="info">
      <Alert show-icon>No hubs yet.</Alert>
    </div>

    <hub v-for="hub in hubs"
    :name="hub.id"
    :key="hub.id"
    :label="hub.label"
    :boardId="boardId"
    :hubId="hub.id"
    ></hub>
  </div>
</template>

<script>
import Hub from "./Hub.vue";
import boardsStore from "../store/modules/boardsStore";

export default {
  props: ["boardId", "label", "selectedTab"],

  components: {
    Hub
  },

  data() {
    return {
      hubs: []
    };
  },

  computed: {
    isBoardEmpty() {
      return !this.hubs.length;
    }
  },

  methods: {
    fetchBoardItems() {
      this.hubs = boardsStore.getHubs(this.boardId);
    }
  },

  created() {
    this.fetchBoardItems();
  }
};
</script>

<style>
.tab-content {
  background: #eee;
  padding: 20px;
}
</style>