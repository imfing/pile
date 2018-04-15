<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content">
        <div v-if="isHubEmpty">
          <Alert show-icon>{{$t("m.info.emptyHub")}}</Alert>
        </div>

        <draggable v-model="items" 
        :options="{animation:150}"
        class="drag-box"
        @change="handleDragItem"
        @start="drag=true"
        @end="drag=false">
          <div v-for="item in items" :key="item.id">
            <hub-item
              @deleteItem="removeHubItem"
              @submitRename="saveRename"
              :label="item.label"
              :itemId="item.id"
              :path="item.path"></hub-item>
          </div>
        </draggable>
      </div>

      <div slot="extra">
        <Dropdown placement="bottom-end" @on-click='handleHubOptions'>
          <Button type="text">
              <Icon type="more"></Icon>
          </Button>
          <DropdownMenu slot="list">
              <DropdownItem name='hub-rename'>{{$t("m.action.rename")}}</DropdownItem> 
              <DropdownItem name='hub-delete'>{{$t("m.action.delete")}}</DropdownItem>            
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>

    <rename-modal :renameModal="renameHubModal"
    :oldContent="this.label"
    @submitRename="renameHub"
    @closeRenameModal="renameHubModal=false;">
    </rename-modal>
  </div>
</template>

<script>
import HubItem from "./HubItem.vue";
import boardsStore from "../store/modules/boardsStore";
import RenameModal from "./RenameModal.vue";
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
      let url = e.dataTransfer.getData("text");
      if (url.length && url[0] != " ") {
        this.handleUrlDrop(url);
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
    RenameModal,
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
      const fs = require("fs");
      const path = require("path");

      let i;
      for (i = 0; i < files.length; i++) {
        var filepath = files[i].path;

        if (fs.lstatSync(filepath).isDirectory()) {
          boardsStore.addHubItem(
            this.boardId,
            this.hubId,
            filepath,
            this.getLabel(filepath)
          );
        } else {
          var filename = path.basename(filepath);
          var filetype = path.extname(filename);
          if (filetype == ".lnk") {
            try {
              var spath = shell.readShortcutLink(filepath);
              boardsStore.addHubItem(
                this.boardId,
                this.hubId,
                spath.target,
                this.getLabel(spath.target)
              );
            } catch (err) {
              this.$Message.error(this.$i18n.t("m.info.lnkError"));
            }
          } else {
            boardsStore.addHubItem(
              this.boardId,
              this.hubId,
              filepath,
              this.getLabel(filepath)
            );
          }
        }
      }

      this.fetchHubItems();
    },
    async handleUrlDrop(url) {
      if (this.isURL(url)) {
        boardsStore.addHubItem(
          this.boardId,
          this.hubId,
          url,
          url.split("/")[2]
        );
        this.fetchHubItems();
      } else {
        this.$Message.error(this.$i18n.t("m.info.urlError"));
      }
    },
    getLabel(path) {
      return path
        .split("\\")
        .pop()
        .split("/")
        .pop();
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
      this.renameHubModal = false;
      this.$Message.success(this.$i18n.t("m.modal.rename.success.hub"));
    },
    handleHubOptions: function(name) {
      if (name == "hub-rename") {
        this.renameHubModal = true;
      } else if (name == "hub-delete") {
        this.$Modal.confirm({
          title: this.$i18n.t("m.modal.delete.title") + ` '${this.label}' ?`,
          okText: this.$i18n.t("m.modal.delete.ok"),
          cancelText: this.$i18n.t("m.modal.delete.cancel"),
          content:
            `<p>` +
            this.$i18n.t("m.modal.delete.content") +
            ` <strong>"${this.label}"</strong>?</p>`,
          onOk: () => {
            boardsStore.removeHub(this.boardId, this.hubId);
            this.deleteHub();
            this.$Message.info(this.$i18n.t("m.modal.delete.success.hub"));
          }
        });
      }
    },
    handleDragItem() {
      boardsStore.saveHubItemsArray(this.boardId, this.hubId, this.items);
    },
    saveRename(itemId, content) {
      boardsStore.setHubItemLabel(this.boardId, this.hubId, itemId, content);
      this.fetchHubItems();
      this.$Message.success(this.$i18n.t("m.modal.rename.success.item"));
    },
    isURL(str) {
      return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str);
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