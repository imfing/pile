<template>
  <div class="tab-content">

    <div>
      <Dropdown style="margin-bottom:10px;" @on-click="addNewHub">
        <Button type="ghost">
            New Hub
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name='new-hub-item'>Item</DropdownItem>
            <DropdownItem name='new-hub-note'>Note</DropdownItem>
            <DropdownItem name='new-hub-todo'>Todo</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    
    <div v-if="isBoardEmpty" class="info">
      <Alert show-icon>No hubs yet.</Alert>
    </div>
    
    <div v-for="hub in hubs" class="hub" :key="hub.id">
      <hub v-if="hub.type=='item'"
        :name="hub.id"
        :label="hub.label"
        :boardId="boardId"
        :hubId="hub.id"
        @refreshHub="fetchBoardItems"
        ></hub>
        
      <hub-note v-if="hub.type=='note'"
        :name="hub.id"
        :label="hub.label"
        :boardId="boardId"
        :hubId="hub.id"
        @refreshHub="fetchBoardItems"></hub-note>

      <hub-todo v-if="hub.type=='todo'"
        :name="hub.id"
        :label="hub.label"
        :boardId="boardId"
        :hubId="hub.id"
        @refreshHub="fetchBoardItems"></hub-todo>      
    </div>

  </div>
</template>

<script>
import Hub from "./Hub.vue";
import HubNote from "./HubNote.vue";
import HubTodo from "./HubTodo.vue";

import boardsStore from "../store/modules/boardsStore";

export default {
  props: ["boardId", "label", "selectedTab"],

  components: {
    Hub,
    HubNote,
    HubTodo
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
        boardsStore.addHubToEnd(this.boardId, "item", "App/Files");
        this.fetchBoardItems();
      } else if (name == "new-hub-note") {
        boardsStore.addHubToEnd(this.boardId, "note", "Notes");
        this.fetchBoardItems();
      } else if (name == "new-hub-todo") {
        boardsStore.addHubToEnd(this.boardId, "todo", "Todo");
        this.fetchBoardItems();
      }
    }
  },

  created() {
    this.fetchBoardItems();
  }
};
</script>

<style>
.hub {
  margin-bottom: 10px;
}
.tab-content {
  min-height: 300px;
}
</style>