<template>
  <div class="tab-content">
    <div v-if="isBoardEmpty" class="info">
      <Alert show-icon>No hubs yet.</Alert>
    </div>

    <div>
      <Dropdown style="margin-bottom:10px;" @on-click="addNewHub">
        <Button type="ghost">
            New Hub
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name='new-hub-item'>Item</DropdownItem>
            <DropdownItem name='new-hub-url'>Url</DropdownItem>
            <DropdownItem name='new-hub-todo'>Todo</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    
    <hub v-for="hub in hubs" class="hub" 
    :name="hub.id"
    :key="hub.id"
    :label="hub.label"
    :boardId="boardId"
    :hubId="hub.id"
    @refreshHub="fetchBoardItems"
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
    },
    addNewHub: function(name) {
      if (name == "new-hub-item") {
        boardsStore.addHubToEnd(this.boardId, name);
        this.fetchBoardItems()
      } else if (name == "new-hub-url") {
      } else if (name == "new-hub-todo") {
      }
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
  height: 100vh;
}

.hub {
  margin-bottom: 10px;
}
</style>