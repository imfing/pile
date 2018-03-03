<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content">
        <div v-if="isHubEmpty">
          <Alert show-icon>Drag something here.</Alert>
        </div>

        <draggable v-model="items" 
        :options="{group:'people'}" class="drag-box"
        @change="handleDragItem"
        @start="drag=true"
        @end="drag=false">
          <div v-for="item in items" :key="item.id">
            <hub-item
              @deleteItem="removeHubItem"
              :itemId="item.id"
              :path="item.path"></hub-item>
          </div>
        </draggable>
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

    <rename-hub-modal :renameHubModal="renameHubModal"
    :original-name="this.label"
    @submitHubName="renameHub"
    @closeRenameHubModal="closeRenameHubModal"
    ></rename-hub-modal>
  </div>
</template>

<script>
import HubItem from "./HubItem.vue";
import boardsStore from "../store/modules/boardsStore";
import RenameHubModal from "./RenameHubModal.vue";
import { basename, extname } from "path";
import { shell } from "electron";
import draggable from "vuedraggable";

export default {
  mounted: function() {
    this.$el.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files.length) {
        this.handleDrop(e.dataTransfer.files);
      }
      return false;
    });
    this.$el.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  },

  props: ["boardId", "label", "hubId"],

  components: {
    HubItem,
    RenameHubModal,
    draggable
  },

  computed: {
    isHubEmpty() {
      return !this.items.length;
    }
  },

  data() {
    return {
      inputValue: "",
      items: [],
      renameHubModal: false
    };
  },

  methods: {
    async handleDrop(files) {
      var filepath = files[0].path;
      const fs = require("fs");
      const path = require("path");

      if (fs.lstatSync(filepath).isDirectory()) {
        boardsStore.addHubItem(this.boardId, this.hubId, filepath);
      } else {
        var filename = path.basename(filepath);
        var filetype = path.extname(filename);
        if (filetype == ".lnk") {
          // console.log(filepath)
          var spath = shell.readShortcutLink(filepath);
          // console.log(spath)
          boardsStore.addHubItem(this.boardId, this.hubId, spath.target);
        } else {
          boardsStore.addHubItem(this.boardId, this.hubId, filepath);
        }
      }

      this.fetchHubItems();
    },
    fetchHubItems() {
      this.items = boardsStore.getHubItems(this.boardId, this.hubId);
    },
    removeHubItem(itemId) {
      boardsStore.removeHubItem(this.boardId, this.hubId, itemId);
      this.fetchHubItems();
    },
    deleteHub() {
      this.$emit("refreshHub");
    },
    renameHub(newname) {
      boardsStore.setHubLabel(this.boardId, this.hubId, newname);
      this.$emit("refreshHub");
      this.closeRenameHubModal();
      this.$Message.success("Rename ok");
    },
    showRenameHubModal() {
      this.renameHubModal = true;
    },
    closeRenameHubModal() {
      this.renameHubModal = false;
    },
    handleHubOptions: function(name) {
      if (name == "hub-rename") {
        this.showRenameHubModal();
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
    },
    handleDragItem() {
      boardsStore.saveHubItemsArray(this.boardId, this.hubId, this.items)
    }
  },

  created() {
    this.fetchHubItems();
  }
};
</script>

<style>
.hub-content {
  min-height: 70px;
}

.drag-box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
}
</style>