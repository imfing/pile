<template>
  <div>
    <Card>
      <div style="text-align:center">
        <img ref="icon" src="">
        <p>{{this.label}}</p>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  props: ["title", "path"],

  computed: {
    label() {
      // return this.path.split('\\').pop().split('/').pop();
      return 'test'
    }
  },

  mounted: function() {
    // Get icon given the path
    var app = require("electron").remote.app;
    var self = this;
    app.getFileIcon(this.path, { size: "large" }, function(err, res) {
      self.$refs.icon.src = res.toDataURL();
    });
  }
};
</script>

<style>

</style>

