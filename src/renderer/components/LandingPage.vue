<template>
  <div id="wrapper">
    <Row>
      <Col span="24" style="background: #eee;padding:16px;">
        <Tabs type="card" closable @on-tab-remove="handleTabRemove">
          <TabPane v-for="board in boards"
          :label="boardTabLabel(board.label, board.id)"
          :name="board.id"
          :key="board.id">
            <board :boardId="board.id"
                  :selectedTab="selectedTab"
            ></board>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  </div>
</template>

<script>
import Board from "./Board.vue";
import boardsStore from "../store/modules/boardsStore";

const remote = require("electron").remote;

export default {
  components: {
    Board
  },

  data() {
    return {
      boards: [],
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
    handleTabRemove(name) {
      this["tab" + name] = false;
    },
    loadBoards() {
      this.boards = boardsStore.getList();
    },
    saveActiveBoard(boardId) {
      boardsStore.setActiveBoard(boardId);
    }
  },

  created() {
    this.loadBoards();
  }
};
</script>

<style>

</style>

