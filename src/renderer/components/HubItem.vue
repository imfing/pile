<template>
  <div @click="openLink" class="hubitem" :title="path">
    <div style="text-align:center; margin-bottom:5px;">
      <Icon v-if="this.isDir" type="folder" size=52></Icon>
      <Icon v-if="this.isMissing" type="close" size=52 color="#ed3f14"></Icon>      
      <img v-if="(!this.isDir)&&(!this.isMissing)" ref="icon" src="" width="48px" height="48px">
      <p style="font-size:12px;">{{this.displayLabel}}</p>
    </div>

    <rename-modal :renameModal="renameModal"
                :oldContent="this.label"
                @submitRename="submitRename"
                @closeRenameModal="renameModal=false;"
                ></rename-modal>
  </div>
</template>

<script>
import { shell } from "electron";
const { remote } = require("electron");
const { Menu, MenuItem } = require("electron").remote;
import boardsStore from "../store/modules/boardsStore";
import RenameModal from "./RenameModal.vue";

export default {
  props: ["label", "path", "itemId"],

  components: {
    RenameModal
  },

  data() {
    return {
      isDir: false,
      isMissing: false,
      renameModal: false
    };
  },

  computed: {
    displayLabel() {
      // return filename or path name
      var length = 10;
      var displayName =
        this.label.length > length
          ? this.label.substring(0, length - 3) + "..."
          : this.label;
      return displayName;
    }
  },

  mounted: function() {
    // Get icon given the path
    var app = require("electron").remote.app;
    const path = require("path");
    const fs = require("fs");

    // Add context menu first
    this.$el.addEventListener(
      "contextmenu",
      e => {
        e.preventDefault();
        const menu = new Menu();
        let me = this;

        menu.append(
          new MenuItem({
            label: this.$i18n.t("m.action.rename"),
            click() {
              me.renameModal = true;
            }
          })
        );
        menu.append(
          new MenuItem({
            label: this.$i18n.t("m.action.openFolder"),
            click() {
              const path = require("path");
              shell.showItemInFolder(me.path);
            }
          })
        );
        menu.append(
          new MenuItem({
            label: this.$i18n.t("m.action.delete"),
            click() {
              me.deleteItem();
            }
          })
        );

        menu.popup(remote.getCurrentWindow());
      },
      false
    );

    var self = this;

    if (fs.existsSync(this.path)) {
      if (fs.lstatSync(this.path).isDirectory()) {
        this.isDir = true;
      } else {
        var filename = path.basename(this.path);
        var filetype = path.extname(filename);

        app.getFileIcon(this.path, { size: "large" }, function(err, res) {
          self.$refs.icon.src = res.toDataURL();
        });
      }
    } else {
      this.isMissing = true;
    }
  },

  methods: {
    openLink() {
      // shell.openExternal(this.path);
      shell.openItem(this.path);
    },
    deleteItem: function() {
      this.$emit("deleteItem", this.itemId);
    },
    submitRename: function(content) {
      this.$emit("submitRename", this.itemId, content);
      this.renameModal = false;
    }
  }
};
</script>

<style>
.hubitem {
  cursor: pointer;
  width: 100px;
  height: 70px;
}
</style>

