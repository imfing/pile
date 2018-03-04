<template>
  <div class="hub-item-todo">
    <Row class="todo-row">
      <Checkbox :value="isDone"
      @on-change="changeIsDone"></Checkbox>
      <span v-html="textWithLink"
          @click="handleLinkClick"></span>
    </Row>

    <edit-modal :editModal="editModal"
            :oldContent="this.content"
            @submitEdit="submitEdit"
            @closeEditModal="editModal=false;"
            ></edit-modal>
  </div>
</template>


<script>
import { shell } from "electron";
const { remote } = require("electron");
const { Menu, MenuItem } = require("electron").remote;
import boardsStore from "../store/modules/boardsStore";
import EditModal from "./EditModal.vue";

export default {
  props: ["content", "itemId", "isDone"],

  components: {
    EditModal
  },

  data() {
    return {
      editModal: false
    };
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

  methods: {
    changeIsDone(newVal) {
      this.$emit("changeIsDone", this.itemId, newVal);
    },
    handleLinkClick(event) {
      if (event.target.className === "link") {
        event.preventDefault();
        shell.openExternal(event.target.title);
      }
    },
    deleteItem: function() {
      this.$emit("deleteItem", this.itemId);
    },
    submitEdit: function(content) {
      this.$emit("submitEdit", this.itemId, content);
      this.editModal = false;
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
            label: this.$i18n.t("m.action.edit"),
            click() {
              me.editModal = true;
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
  }
};
</script>

<style>
.hub-item-todo {
  border-bottom: 1px dashed #e9eaec;
}

.todo-row {
  padding-top: 4px;
  padding-bottom: 4px;
}

.hub-item-todo:hover .todo-row {
  background-color: #f8f8f9;
}
</style>
