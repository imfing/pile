<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "pile"
};
</script>

<style>
/* CSS */
body::-webkit-scrollbar {
  width: 8px;
}

body::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  background: #eee;
}

body::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 8px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
