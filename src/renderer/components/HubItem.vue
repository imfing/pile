<template>
  <div @click="openLink" class="hubitem">
    <Card :bordered="false" dis-hover>
      <div style="text-align:center">
        <img ref="icon" src="">
        <p>{{this.label}}</p>
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
    var self = this;
    app.getFileIcon(this.path, { size: "large" }, function(err, res) {
      self.$refs.icon.src = res.toDataURL();
    });

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
              // console.log(me.path);
              // console.log(me.itemId);
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
              shell.openExternal(path.dirname(me.path));
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
      shell.openExternal(this.path);
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

