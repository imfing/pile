<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content-note">
        <form action="">
          <Row style="margin-bottom:5px;">
            <Col :xs="22" :sm="22" :md="23" :lg="23">
              <Input type="textarea"
                    v-model="newNote"
                    :autosize="true" 
                    v-bind:placeholder="$t('m.note.placeholder')"
                    icon="plus"
                    @on-keypress="handleCtrlEnter($event)"
                    ></Input>
            </Col>
            <Col :xs="2" :sm="2" :md="1" :lg="1"
                 style="text-align: center;">
              <Button type="dashed" shape="circle" icon="plus" @click="submitNewNote"
              style="display: inline-block;"></Button>
            </Col>
          </Row>
        </form>

        <draggable v-model="items"
        :options="{animation:150}"        
        @change="handleDragItem"
        @start="drag=true"
        @end="drag=false">
          <hub-item-note v-for="item in items"
          :key="item.id"
          :itemId="item.id"
          :content="item.content"
          @deleteItem="removeHubItem"
          @submitEdit="saveEdit"
          ></hub-item-note>
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
import { shell } from "electron";
import boardsStore from "../store/modules/boardsStore";
import RenameModal from "./RenameModal.vue";
import HubItemNote from "./HubItemNote.vue";
import draggable from "vuedraggable";

export default {
  props: ["boardId", "label", "hubId"],

  components: {
    RenameModal,
    HubItemNote,
    draggable
  },

  data() {
    return {
      newNote: "",
      renameHubModal: false,
      items: []
    };
  },

  computed: {},

  methods: {
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
    submitNewNote() {
      if (this.newNote.trim().length === 0) {
        this.newNote = "";
        return;
      }
      boardsStore.addHubNote(this.boardId, this.hubId, this.newNote);
      this.newNote = "";
      this.fetchHubItems();
    },
    saveEdit(itemId, content) {
      boardsStore.setHubItemContent(this.boardId, this.hubId, itemId, content);
      this.fetchHubItems();
      this.$Message.success(this.$i18n.t("m.modal.edit.success.note"));
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
    handleDragItem() {
      boardsStore.saveHubItemsArray(this.boardId, this.hubId, this.items);
    },
    handleCtrlEnter: function(e) {
      if ((e.metaKey || e.ctrlKey) && (e.keyCode == 10 || e.keyCode == 13)) {
        this.submitNewNote();
      }
    }
  },

  created() {
    this.fetchHubItems();
  }
};
</script>


<style>
.hub-content-note {
  min-height: 20px;
}
</style>
