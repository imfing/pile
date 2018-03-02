<template>
  <div>
    <Card>
      <p slot="title">{{this.label}}</p>
      <div class="hub-content-note">
        <form action="">
          <Row style="margin-bottom:5px;">
            <Col :xs="20" :sm="22" :md="22" :lg="22">
              <Input
                    v-model="newTodoItem"
                    icon="plus" 
                    placeholder="Enter new todo..."
                    @on-enter="submitTodo"
                    @on-click="submitTodo"
                    ></Input>
            </Col>
            <Col :xs="4" :sm="2" :md="2" :lg="2"
                 style="text-align: center;">
                  <i-switch
                  v-model="showDone" 
                  size="large"
                  @on-change="toggleDone">
                    <span slot="open">Todo</span>
                    <span slot="close">Done</span>
                  </i-switch>
            </Col>
          </Row>
        </form>

        <div v-for="item in items"
        :key="item.id">
          <div v-if="!showDone">
            <hub-item-todo v-if="!item.isDone"
            :content="item.content"
            :itemId="item.id"
            :isDone="item.isDone"
            @changeIsDone="changeIsDone"
            @deleteItem="removeHubItem"
            ></hub-item-todo>
          </div>
          <div v-else>
            <hub-item-todo v-if="item.isDone"
            :content="item.content"
            :itemId="item.id"
            :isDone="item.isDone"
            @changeIsDone="changeIsDone"
            @deleteItem="removeHubItem"
            ></hub-item-todo>
          </div>
        </div>
      </div>
      <div slot="extra">
        <Dropdown @on-click='handleHubOptions'>
          <Button type="text">
              <Icon type="more"></Icon>
          </Button>
          <DropdownMenu slot="list">
              <DropdownItem name='hub-rename'>Rename</DropdownItem>
              <DropdownItem name='hub-delete'>Delete</DropdownItem>            
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
import HubItemTodo from "./HubItemTodo.vue";

export default {
  props: ["boardId", "label", "hubId"],

  components: {
    RenameHubModal,
    HubItemTodo
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
        this.showRenameHubModal();
      } else if (name == "hub-delete") {
        this.$Modal.confirm({
          title: `Remove hub '${this.label}' ?`,
          okText: "OK, remove it",
          cancelText: "Cancel",
          content: `<p>Remove hub <strong>"${this.label}"</strong>?</p>`,
          onOk: () => {
            boardsStore.removeHub(this.boardId, this.hubId);
            this.deleteHub();
            this.$Message.info("Hub removed");
          }
        });
      }
    },
    changeIsDone(itemId, newVal) {
      boardsStore.setTodoIsDone(this.boardId, this.hubId, itemId, newVal);
      this.fetchHubItems();
    },
    toggleDone(state){
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
      this.closeRenameHubModal();
      this.$Message.success("Rename ok");
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

</style>

