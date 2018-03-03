<template>
  <div class="hub-item-note">
    <Row class="note-row">
      <!-- <span v-html="textWithLink"
        @click="handleLinkClick"></span> -->
      <vue-markdown>{{this.content}}</vue-markdown>
    </Row>
  </div>
</template>

<script>
import { shell } from "electron";
const { remote } = require("electron");
const { Menu, MenuItem } = require("electron").remote;
import boardsStore from "../store/modules/boardsStore";
import VueMarkdown from "vue-markdown";

export default {
  props: ["content", "itemId"],

  components: {
    VueMarkdown
  },

  data() {
    return {};
  },

  computed: {
    textWithLink() {
      var Autolinker = require("autolinker");
      var rawText = this.content;
      var linkedText = Autolinker.link(rawText, {
        className: "link",
        replaceFn: function(match) {
          switch (match.getType()) {
            case "url":
              var url = match.getUrl();
              return `<span class='link' title="${url}">${
                url.split("/")[2]
              }</span>`;
          }
        }
      });
      return linkedText;
    }
  },

  mounted: function() {
    // Add context menu
    this.$el.addEventListener(
      "contextmenu",
      e => {
        e.preventDefault();
        const menu = new Menu();
        let me = this;
        menu.append(
          new MenuItem({
            label: "Edit",
            click() {
              // Todo
            }
          })
        );
        menu.append(
          new MenuItem({
            label: "Delete",
            click() {
              me.deleteItem();
            }
          })
        );
        menu.popup(remote.getCurrentWindow());
      },
      false
    );
  },

  methods: {
    handleLinkClick(event) {
      if (event.target.className === "link") {
        event.preventDefault();
        shell.openExternal(event.target.title);
      }
    },
    deleteItem: function() {
      this.$emit("deleteItem", this.itemId);
    }
  }
};
</script>

<style>
/* @import url('../../../static/katex.min.css'); */
/* @import url('../../../static/prism.css'); */

.hub-item-note {
  border-bottom: 1px dashed #e9eaec;
}

.note-row {
  padding-top: 2px;
  padding-bottom: 2px;
}

.hub-item-note:hover .note-row {
  background-color: #f8f8f9;
}
</style>