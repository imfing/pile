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
            :path="item.path"></hub-item>
          </Col>
        </Row>
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
    isHubEmpty(){
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
      console.log(filepath);
      this.items.push({
        'path': filepath,
        'id': 'lala' //TODO
      });
    },
    fetchHubItems() {
      this.items = boardsStore.getHubItems(this.boardId, this.hubId);
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