<template>
  <div @click="openLink" class="hubitem">
    <Card :bordered="false" dis-hover>
      <div style="text-align:center">
        <Icon v-if="this.isDir" type="folder" size=52></Icon>
        <img v-if="!this.isDir" ref="icon" src="" width="48px" height="48px">
        <p style="font-size:12px;">{{this.label}}</p>
      </div>
    </Card>
  </div>
</template>

<script>
import { shell } from "electron";
const { remote } = require("electron");
const { Menu, MenuItem } = require("electron").remote;
import boardsStore from "../store/modules/boardsStore";

export default {
  props: ["title", "path", "itemId"],

  data() {
    return {
      isDir : false
    };
  },

  computed: {
    label() {
      // return filename or path name
      return this.path
        .split("\\")
        .pop()
        .split("/")
        .pop();
    }
  },

  mounted: function() {
    // Get icon given the path
    var app = require("electron").remote.app;
    const path = require("path");
    const fs = require("fs");
    
    var self = this;

    if (fs.lstatSync(this.path).isDirectory()) {
      this.isDir = true;
    }
    else{
      var filename = path.basename(this.path);
      var filetype = path.extname(filename);
      
      app.getFileIcon(this.path, { size: "large" }, function(err, res) {
            self.$refs.icon.src = res.toDataURL();
          });
    }
    
    // Add context menu
    this.$el.addEventListener(
      "contextmenu",
      e => {
        e.preventDefault();
        const menu = new Menu();
        let me = this;
        menu.append(
          new MenuItem({
            label: "Delete",
            click() {
              me.deleteItem();
            }
          })
        );
        menu.append(
          new MenuItem({
            label: "Open folder",
            click() {
              // const fs = require('fs');
              // console.log(fs.lstatSync(me.path).isDirectory())
              const path = require("path");
              // shell.openExternal(path.dirname(me.path));
              shell.showItemInFolder(me.path);
            }
          })
        );
        menu.popup(remote.getCurrentWindow());
      },
      false
    );
  },

  methods: {
    openLink() {
      // shell.openExternal(this.path);
      shell.openItem(this.path);
    },
    deleteItem: function() {
      this.$emit("deleteItem", this.itemId);
    }
  }
};
</script>

<style>
.hubitem {
  cursor: pointer;
}
</style>

