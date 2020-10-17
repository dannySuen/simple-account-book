<template>
    <div>
        <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
    <div class="dialog-content">
        <el-date-picker
      v-model="dateValue"
      type="date"
      placeholder="选择日期" @change='changeDate(dateValue)' value-format='timestamp' class="date-picker">
    </el-date-picker>
    <el-select v-model="inoutValue" placeholder="请选择" class="type-picker">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
      <el-input v-model="amountValue" placeholder="请输入内容" clearable class="input-with-select price" type="number" >
            <el-select v-model='typeValue' placeholder='请选择' slot="prepend" @change='changeType(typeValue)'  @clear="clearType(typeValue)" class='choose'>
                <el-option v-for='(value,index) in Categories' :key='index' :label='value.name' :value='value.name'></el-option>
            </el-select>
      </el-input>
    </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    </div>
</template>
<style scoped>
    .dialog-content /deep/ .choose .el-input {
    width: 130px !important;
  }
  .price>.el-input_inner{
      width: 50%;
  }
  .date-picker,.type-picker{
      margin-bottom:25px;
      width: 100%;
  }
</style>
<script>
export default {
  props: [
    'dialogVisibleA', 'Categories'
  ],
  data () {
    return {
      typeValue: '',
      dialogVisible: false,
      amountValue: '',
      dateValue: '',
      createdMessage: {},
      inoutValue: '',
      options: [{
        value: '0',
        label: '支出'
      }, {
        value: '1',
        label: '收入'
      }]
    }
  },
  watch: {
    dialogVisibleA (value, oldvalue) {
    //   console.log(value, oldvalue)
      if (value) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
      }
    },
    Categories (value, oldvalue) {
    //   console.log(value, oldvalue)
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
      this.dateValue = ''
      this.amountValue = ''
      this.typeValue = ''
      this.$emit('closeEditDialog', false)
    },
    changeType (value) {
      console.log(value)
    },
    changeDate (value) {
    //   console.log(value)
    },
    submit () {
      if (this.dateValue && this.amountValue && this.typeValue && this.inoutValue) {
        let typeId = this.Categories.filter(item => item.name === this.typeValue)
        this.createdMessage = {'amount': this.amountValue,
          'category': typeId[0].id,
          'id': '',
          'name': this.typeValue,
          'time': this.dateValue,
          'type': typeId[0].type}
        this.$emit('createdMessage', this.createdMessage, false)
        this.$message('添加成功')
        this.close()
      } else {
        this.$message('请填写空缺信息')
      }
    }
  }
}
</script>
