<template>
  <div class="hub-item-note">
    <Row class="note-row">
      <vue-markdown v-bind:source="this.content"
      ></vue-markdown>
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
import VueMarkdown from "vue-markdown";
import EditModal from "./EditModal.vue";

export default {
  props: ["content", "itemId"],

  components: {
    VueMarkdown,
    EditModal
  },

  data() {
    return {
      editModal: false
    };
  },

  mounted: function() {
    // Open <a> tag in external browser
    this.$el.addEventListener("click", function(event) {
      if (
        event.target.tagName === "A" &&
        event.target.href.startsWith("http")
      ) {
        event.preventDefault();
        shell.openExternal(event.target.href);
      }
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
    },
    submitEdit: function(content) {
      this.$emit("submitEdit", this.itemId, content);
      this.editModal = false;
    }
  }
};
</script>

<style>
.hub-item-note {
  border-bottom: 1px dashed #e9eaec;
}

.note-row {
  padding: 0px 5px;
}

.hub-item-note:hover .note-row {
  background-color: #f8f8f9;
}
</style>