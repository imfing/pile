<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content-note">
        <Row style="margin-bottom:5px;">
          <Col :xs="20" :sm="21" :md="22" :lg="22">
            <Input
                  v-model="newTodoItem"
                  icon="plus" 
                  v-bind:placeholder="$t('m.todo.hint')"
                  @on-enter="submitTodo"
                  @on-click="submitTodo"
                  ></Input>
          </Col>
          <Col :xs="4" :sm="3" :md="2" :lg="2"
                style="text-align: center;">
                <i-switch
                v-model="showDone" 
                size="large"
                @on-change="toggleDone">
                  <span slot="open">{{$t("m.todo.todo")}}</span>
                  <span slot="close">{{$t("m.todo.done")}}</span>
                </i-switch>
          </Col>
        </Row>

        <draggable v-model="items"
        :options="{animation:150}"        
        @change="handleDragItem"
        @start="drag=true"
        @end="drag=false">

          <div v-for="item in items"
          :key="item.id">
            <div v-if="!showDone">
              <hub-item-todo v-if="!item.isDone"
              :content="item.content"
              :itemId="item.id"
              :isDone="item.isDone"
              @changeIsDone="changeIsDone"
              @deleteItem="removeHubItem"
              @submitEdit="saveEdit"
              ></hub-item-todo>
            </div>
            <div v-else>
              <hub-item-todo v-if="item.isDone"
              :content="item.content"
              :itemId="item.id"
              :isDone="item.isDone"
              @changeIsDone="changeIsDone"
              @deleteItem="removeHubItem"
              @submitEdit="saveEdit"
              ></hub-item-todo>
            </div>
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
import { shell } from "electron";
import boardsStore from "../store/modules/boardsStore";
import RenameModal from "./RenameModal.vue";
import HubItemTodo from "./HubItemTodo.vue";
import draggable from "vuedraggable";

export default {
  props: ["boardId", "label", "hubId"],

  components: {
    RenameModal,
    HubItemTodo,
    draggable
  },

  data() {
    return {
      testcontent: "hahaha",
      newTodoItem: "",
      renameHubModal: false,
      items: [],
      showDone: false
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
    changeIsDone(itemId, newVal) {
      boardsStore.setTodoIsDone(this.boardId, this.hubId, itemId, newVal);
      this.fetchHubItems();
    },
    toggleDone(state) {
      // console.log(this.showDone);
      this.fetchHubItems();
    },
    submitTodo() {
      if (this.newTodoItem.trim().length === 0) {
        this.newTodoItem = "";
        return;
      }
      boardsStore.addHubTodoItem(this.boardId, this.hubId, this.newTodoItem);
      this.newTodoItem = "";
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
      this.renameHubModal = false;
      this.$Message.success(this.$i18n.t("m.modal.rename.success.hub"));
    },
    saveEdit(itemId, content) {
      boardsStore.setHubItemContent(this.boardId, this.hubId, itemId, content);
      this.fetchHubItems();
      this.$Message.success(this.$i18n.t("m.modal.edit.success.note"));
    },
    handleDragItem() {
      boardsStore.saveHubItemsArray(this.boardId, this.hubId, this.items);
    }
  },

  created() {
    this.fetchHubItems();
  }
};
</script>

<style>

</style>

