<template>
  <div id="wrapper">
    <Row id="tabrow">
      <Col span="24" style="background: #eee;padding:16px;">
        <Tabs v-model="selectedTab" 
              type="card" 
              closable
              @on-click="saveActiveBoard"
              style="margin-top:5px;">
          <TabPane v-for="board in boards"
          :label="boardTabLabel(board.label, board.id)"
          :name="board.id"
          :key="board.id">
            <board :boardId="board.id"
                  :selectedTab="selectedTab"
            ></board>
          </TabPane>
          <div slot="extra">
            <Tooltip placement="bottom-end" :transfer="true" :delay="500">
              <Button type="ghost"
                      @click="showNewBoardModal"
                      size="small"
                      icon="plus"
                      shape="circle"
                      style="margin-right: 5px;">
              </Button>
              <div slot="content">
                {{$t("m.board.new.tip")}}
              </div>
            </Tooltip>
          </div>
        </Tabs>
      </Col>
    </Row>
    <new-board-modal :newBoardModal="newBoardModal"
                     @submitNewBoard="submitNewBoard"
                     @closeNewBoardModal="closeNewBoardModal">
    </new-board-modal>
  </div>
</template>

<script>
import Board from "./Board.vue";
import NewBoardModal from "./NewBoardModal.vue";
import boardsStore from "../store/modules/boardsStore";

const remote = require("electron").remote;

export default {
  components: {
    Board,
    NewBoardModal
  },

  data() {
    return {
      boards: [],
      newBoardModal: false,
      selectedTab: "default",
      boardTabLabel: (boardLabel, boardId) => h => {
        return h("div", [
          h("span", boardLabel),
          h("Icon", {
            class: {
              "close-icon": true
            },
            props: {
              type: "ios-close-empty"
            },
            nativeOn: {
              click: event => {
                event.stopPropagation();
                this.handleBoardRemove(boardLabel, boardId);
              }
            }
          })
        ]);
      }
    };
  },

  methods: {
    loadBoards() {
      this.boards = boardsStore.getList();
    },
    saveActiveBoard(boardId) {
      boardsStore.setActiveBoard(boardId);
    },
    showNewBoardModal() {
      this.newBoardModal = true;
    },
    closeNewBoardModal() {
      this.newBoardModal = false;
    },
    submitNewBoard(boardName) {
      const savedBoard = boardsStore.saveNewBoard(boardName);
      this.selectedTab = savedBoard.id;
      this.saveActiveBoard(savedBoard.id);
      // this.$nextTick(() => this.$bus.$emit("boardAdded", savedBoard.id));
      this.closeNewBoardModal();
      this.loadBoards();
      this.$Message.success(this.$i18n.t("m.board.new.success"));
    },
    handleBoardRemove(boardLabel, boardId) {
      if (this.boards.length <= 1) {
        this.$Message.error(this.$i18n.t("m.board.lastBoard"));
      } else {
        this.$Modal.confirm({
          title: this.$i18n.t("m.modal.delete.title") + ` '${boardLabel}' ?`,
          okText: this.$i18n.t("m.modal.delete.ok"),
          cancelText: this.$i18n.t("m.modal.delete.cancel"),
          content:
            `<p>` +
            this.$i18n.t("m.modal.delete.content") +
            `<strong>"${boardLabel}"</strong>?</p>`,
          onOk: () => {
            boardsStore.removeBoard(boardId);
            const firstBoardId = boardsStore.getFirstBoard().id;
            boardsStore.setActiveBoard(firstBoardId);
            this.selectedTab = firstBoardId;
            this.loadBoards();
            this.$Message.info(this.$i18n.t("m.modal.delete.success.board"));
          }
        });
      }
    }
  },

  created() {
    var app = require("electron").remote.app;
    let locale = app.getLocale();
    if (locale != "zh-CN") {
      this.$i18n.locale = "en-US";
    }

    this.selectedTab = boardsStore.getActiveBoard();
    this.loadBoards();
  }
};
</script>

<style>
body {
  font-family: "Segoe UI", "Microsoft YaHei", "Lato", sans-serif !important;
  height: 100vh;
  background-color: #eee !important;
}
</style>