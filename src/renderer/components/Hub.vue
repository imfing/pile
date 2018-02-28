<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content">
        <div v-if="isHubEmpty">
          <Alert show-icon>Drag something here.</Alert>
        </div>
        <Row :gutter="16">
          <Col v-for="item in items" :key="item.id" 
          :xs="6" :sm="4" :md="4" :lg="3">
            <hub-item
            @deleteItem="removeHubItem"
            :itemId="item.id"
            :path="item.path"></hub-item>
          </Col>
        </Row>
      </div>
      <div slot="extra">
        <Dropdown @on-click='handleHubOptions'>
          <Button type="text">
              <Icon type="more"></Icon>
          </Button>
          <DropdownMenu slot="list">
              <DropdownItem name='hub-rename'>Rename</DropdownItem>
              <DropdownItem name='hub-delete'>Delete</DropdownItem>            
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>
  </div>
</template>

<script>
import HubItem from "./HubItem.vue";
import boardsStore from "../store/modules/boardsStore";

export default {
  mounted: function() {
    this.$el.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      this.handleDrop(e.dataTransfer.files);
      return false;
    });
    this.$el.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  },

  props: ["boardId", "label", "hubId"],

  components: {
    HubItem
  },

  computed: {
    isHubEmpty() {
      return !this.items.length;
    }
  },

  data() {
    return {
      items: []
    };
  },

  methods: {
    async handleDrop(files) {
      var filepath = files[0].path;
      // console.log(filepath);
      boardsStore.addHubItem(this.boardId, this.hubId, filepath);
      this.fetchHubItems();
    },
    fetchHubItems() {
      this.items = boardsStore.getHubItems(this.boardId, this.hubId);
    },
    removeHubItem(itemId) {
      boardsStore.removeHubItem(this.boardId, this.hubId, itemId);
      this.fetchHubItems();
    },
    deleteHub(){
      this.$emit('deleteHub');
    },
    handleHubOptions: function(name) {
      if (name == "hub-rename") {
      } else if (name == "hub-delete") {
        this.$Modal.confirm({
          title: `Remove hub '${this.label}' ?`,
          okText: "OK, remove it",
          cancelText: "Cancel",
          content: `<p>Remove hub <strong>"${this.label}"</strong>?</p>`,
          onOk: () => {
            boardsStore.removeHub(this.boardId, this.hubId);
            this.deleteHub();
            this.$Message.info("Hub removed");
          }
        });
      }
    }
  },

  created() {
    this.fetchHubItems();
  }
};
</script>

<style>
.hub-content {
  min-height: 100px;
}
</style>