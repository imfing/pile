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
                    ></Input>
            </Col>
            <Col :xs="2" :sm="2" :md="1" :lg="1"
                 style="text-align: center;">
              <Button type="dashed" shape="circle" icon="plus" @click="submitNewNote"
              style="display: inline-block;"></Button>
            </Col>
          </Row>
        </form>

        <hub-item-note v-for="item in items"
        :key="item.id"
        :itemId="item.id"
        :content="item.content"
        @deleteItem="removeHubItem"
        ></hub-item-note>

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
import { shell } from "electron";
import boardsStore from "../store/modules/boardsStore";
import RenameHubModal from "./RenameHubModal.vue";
import HubItemNote from "./HubItemNote.vue"

export default {
  props: ["boardId", "label", "hubId"],
  
  components: {
    RenameHubModal,
    HubItemNote
  },
  
  data() {
    return {
      newNote: "",
      renameHubModal: false,
      items: []
    };
  },

  computed: {

  },

  methods: {
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
    submitNewNote() {
      if (this.newNote.trim().length === 0) {
        this.newNote = "";
        return;
      }
      boardsStore.addHubNote(this.boardId, this.hubId, this.newNote);
      this.newNote=""
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
      this.$Message.success(this.$i18n.t("m.modal.rename.success.hub"));
    },
    showRenameHubModal() {
      this.renameHubModal = true;
    },
    closeRenameHubModal() {
      this.renameHubModal = false;
    }
  },

  created() {
    this.fetchHubItems();
  }
};
</script>


<style>
.hub-content-note{
  min-height: 20px;
}
</style>
