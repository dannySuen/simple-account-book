<template>
  <div>
    <el-dialog
      title="账单明细"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
    <div class="dialog-content">
      <h3>{{getMessage.time | formatdate}}</h3>
      <h2>{{getMessage.name}}</h2>
      <p>¥{{getMessage.amount | price}}</p>
    </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="close"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.dialog-content{
  h3{
    font-weight: normal;
    line-height: 30px;
  }
  h2{
    line-height: 50px;
  }
  p{
    font-size: 20px;
  }
}
</style>
<script>
export default {
  props: ['dialogVisibleP', 'message'],
  data () {
    return {
      getMessage: {},
      dialogVisible: false
    }
  },
  computed: {

  },
  watch: {
    dialogVisibleP (Value, oldValue) {
      // console.log(oldValue, Value)
      if (Value) {
        this.dialogVisible = true
        this.getMessage = this.message
        console.log(this.getMessage)
      } else {
        this.dialogVisible = false
        this.getMessage = {}
      }
    },
    message (Value, oldValue) {
      // console.log(Value, oldValue)
    },
    dialogVisible (Value, oldValue) {
      // console.log(Value, oldValue)
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.close()
        })
        .catch(_ => {})
    },
    close () {
      this.dialogVisible = false
      this.getMessage = {}
      this.$emit('closeDialog', false)
    }

  }
}
</script>
