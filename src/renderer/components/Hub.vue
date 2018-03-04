<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content">
        <div v-if="isHubEmpty">
          <Alert show-icon>{{$t("m.info.emptyHub")}}</Alert>
        </div>

        <draggable v-model="items" 
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
          var spath = shell.readShortcutLink(filepath);
          boardsStore.addHubItem(
            this.boardId,
            this.hubId,
            spath.target,
            this.getLabel(spath.target)
          );
        } else {
          boardsStore.addHubItem(
            this.boardId,
            this.hubId,
            filepath,
            this.getLabel(filepath)
          );
        }
      }

      this.fetchHubItems();
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
      this.closeRenameHubModal();
      this.$Message.success(this.$i18n.t("m.modal.rename.success.hub"));
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
    saveRename(itemId, content){
      boardsStore.setHubItemLabel(this.boardId, this.hubId, itemId, content);
      this.fetchHubItems();
      this.$Message.success(this.$i18n.t("m.modal.rename.success.item"));
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