<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content">
        <Row :gutter="16">
          <Col v-for="item in items" :key="item.id" span="6">
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
        'id': 'lala'
      });
      // var app = require("electron").remote.app;
      // app.getFileIcon(filepath, { size: "large" }, function(err, res) {
      //   console.log(res.toDataURL());
      //   // var im = document.createElement("img");
      //   // im.src = res.toDataURL();
      //   // var div1 = document.getElementsByClassName("sectionfile")[0];
      //   // div1.appendChild(im);
      // });
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