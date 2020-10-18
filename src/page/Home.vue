/* eslint-disable no-constant-condition */
<template>
  <div class="container">
    <el-row class="header">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <h1>简易记账本</h1>
        </div>
      </el-col>
    </el-row>
    <el-row class="filter-content">
      <el-col :span="1"><div class="grid-content"></div></el-col>
      <el-col :span="2">
        <div class="grid-content">选择月份：</div>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          v-model="monthValue"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM"
          @change="changeMonth(monthValue)"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <div class="grid-content">选择类型：</div>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="typeValue"
          placeholder="请选择"
          @change="changeType(typeValue)"
          clearable
          @clear="clearType(typeValue)"
        >
          <el-option
            v-for="(value, index) in Categories"
            :key="index"
            :label="value.name"
            :value="value.name"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" v-if="!typeValue">
        <el-col :span="6"><div class="grid-content">分类：</div></el-col>
        <el-col :span="16">
          <el-select
            v-model="inOutValue"
            placeholder="请选择"
            class="type-picker"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <el-col :span="2">
        <el-button
          type="primary"
          round
          @click="selectList(monthValue, typeValue, inOutValue)"
          >确定</el-button
        >
      </el-col>
      <el-col :span="2">
        <el-button plain round @click="editAccount()">添加</el-button>
      </el-col>
    </el-row>
    <el-row class="table-content">
      <el-col :span="2"><div class="grid-content"></div></el-col>
      <el-col :span="18">
        <el-table
          :data="showList"
          style="width: 100%"
          :default-sort="{ prop: 'id', order: 'descending' }"
          class="table-bill"
        >
          <el-table-column
            prop="id"
            label="id"
            width="100"
            sortable=""
          ></el-table-column>
          <el-table-column
            label="日期"
            width="180"
            :sortable="true"
            prop="time"
          >
            <template slot-scope="scope">
              {{ scope.row.time | formatdate }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="项目" width="180">
          </el-table-column>
          <el-table-column prop="type" label="分类" width="100">
            <template slot-scope="scope">
              {{ scope.row.type | outin }}
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            :sortable="true"
            :sort-method="sortAmount"
          >
            <template slot-scope="scope">
              ¥ {{ scope.row.amount | price }}
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="false">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row)"
                type="text"
                size="middle"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="2"></el-col>
    </el-row>
    <el-row class="footer">
      <el-row>
        <el-col :span="2">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="2">总计支出：</el-col>
        <el-col :span="2">{{ countExpendsNum }}项</el-col>
        <el-col :span="1">金额：</el-col>
        <el-col :span="2">¥{{ countExpends | price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="2">总计收入：</el-col>
        <el-col :span="2">{{ countIncomeNum }}项</el-col>
        <el-col :span="1">金额：</el-col>
        <el-col :span="2">¥{{ countIncome | price }}</el-col>
      </el-row>
    </el-row>
    <Dialog
      :dialogVisibleP="dialogVisibleP"
      :message="message"
      @closeDialog="closeDialog"
    ></Dialog>
    <AddDialog
      :Categories="Categories"
      :dialogVisibleA="dialogVisibleA"
      @closeEditDialog="closeEditDialog"
      @createdMessage="getNewMessage"
    ></AddDialog>
  </div>
</template>
<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.filter-content {
  height: 40px;
  .grid-content {
    line-height: 40px;
    text-align: center;

  }
}
.table-bill {
  margin-bottom: 150px;
}
.footer {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  margin-bottom: 0;
  padding: 20px 0;
  border-top: 1px solid #999;
  z-index: 2;
}
</style>
<script>
import Dialog from '@/components/Dialog' // 查看弹窗
import AddDialog from '@/components/Add' // 添加弹窗
const d3 = require('d3-dsv')
export default {
  data () {
    return {
      typeValue: '',
      monthValue: '',
      inOutValue: '',
      dialogVisibleP: false,
      dialogVisibleA: false, // 添加账目的弹窗隐藏
      message: {}, // 单条信息传值
      Categories: [], // csv 分类列表
      Bill: [], // csv Bill列表
      newList: [], // 拼接后的列表
      countExpends: 0, // 支出金额
      countExpendsNum: 0, // 支出总项
      countIncome: 0, // 收入金额
      countIncomeNum: 0, // 收入总项
      showList: [], // 显示列表
      chooseList: [], // 条件筛选列表
      createdMessage: {}, // 新添加信息
      options: [
        {
          value: '0',
          label: '支出'
        },
        {
          value: '1',
          label: '收入'
        }
      ]
    }
  },
  components: {
    Dialog,
    AddDialog
  },
  mounted () {
    this.getArr(this.getBill(), this.getCate())
  },
  methods: {
    /* 获取csv */
    getBill () {
      let getbill = new Promise((resolve, reject) => {
        this.axios
          .get('static/csv/bill.csv')
          .then((res) => {
            this.Bill = d3.csvParse(res.data)
            resolve(this.Bill)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      return getbill
    },
    getCate () {
      let getcate = new Promise((resolve, reject) => {
        this.axios
          .get('static/csv/categories.csv')
          .then((res) => {
            this.Categories = d3.csvParse(res.data)
            resolve(this.Categories)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      return getcate
    },
    getArr (bill, cat) {
      Promise.all([bill, cat]).then((res) => {
        // console.log(res)
        this.concatArr(res[0], res[1])
      })
    },
    /* 连接列表 */
    concatArr (bill, cate) {
      // console.log(bill)
      if (bill.length > 0 && cate.length > 0) {
        for (var i = 0; i < bill.length; i++) {
          let p = cate.find((item) => item.id === bill[i].category)
          bill[i].name = p.name
          bill[i].id = i
        }
        this.newList = bill
        this.showList = bill
        this.countBill(this.newList)
        // console.log(this.newList)
      }
    },
    /* 统计列表 */
    countBill (arr) {
      // eslint-disable-next-line eqeqeq
      let expendArr = arr.filter((item) => item.type === '0')
      this.countExpendsNum = expendArr.length
      if (this.countExpendsNum === 0) {
        this.countExpends = 0
      } else {
        this.countExpends = 0
        for (var j = 0; j < expendArr.length; j++) {
          this.countExpends = this.countExpends + Number(expendArr[j].amount)
        }
      }
      // eslint-disable-next-line eqeqeq
      let incomeArr = arr.filter((item) => item.type === '1')
      this.countIncomeNum = incomeArr.length
      if (this.countIncomeNum === 0) {
        this.countIncome = 0
      } else {
        this.countIncome = 0
        for (var a = 0; a < incomeArr.length; a++) {
          this.countIncome = this.countExpends + Number(incomeArr[a].amount)
        }
      }
    },
    /* 改变分类和月份 */
    changeType (value) {
      // console.log(value)
    },
    changeMonth (value) {
      if (value) {
        // console.log('选中月份')
      } else {
        if (this.typeValue === '') {
          this.showList = this.newList
        } else {
          this.selectList(value, this.typeValue)
        }
      }
    },
    /* 筛选列表 */
    selectList (monthvalue, typevalue, inoutvalue) {
      /* 账单分类存在时，忽略收支 */
      if (typevalue) {
        inoutvalue = ''
        /* 清空收支值 */
        this.inOutValue = ''
      }
      /* 初始化筛选条件 */
      let filter = {
        gettime: monthvalue,
        name: typevalue,
        type: inoutvalue
      }
      /* 过滤筛选条件，保留含有值的条件选项 */
      let tempFilter = {}
      let key
      for (key in filter) {
        if (filter[key]) {
          tempFilter[key] = filter[key]
        }
      }
      /* 筛选条件是否为空 */
      var orNotfilter = (JSON.stringify(tempFilter) === '{}')
      if (orNotfilter) {
        this.showList = this.newList
        this.countBill(this.showList)
      } else {
      /* 进行数据筛选 */
        this.chooseList = this.newList.filter((item) => {
        /* 时间戳转换 */
          var getTime = this.timeFormat(item.time)
          item['gettime'] = getTime
          let flag = false
          for (key in tempFilter) {
            if (item[key] === tempFilter[key]) {
              flag = true
            } else {
              flag = false
              break
            }
          }
          if (flag) {
            return item
          }
        })
        this.showList = this.chooseList
        this.countBill(this.showList)
      }
    },
    timeFormat (time) {
      time = Number(time)
      var date = new Date(time)
      var Y = date.getFullYear() + '-'
      var M =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      return Y + M
    },
    /* 金额排序 */
    sortAmount (str1, str2) {
      return str1.amount - str2.amount
    },
    /* 清除分类后恢复列表 */
    clearType (value) {
      if (value === '') {
        if (this.monthValue === '') {
          this.showList = this.newList
        } else {
          this.selectList(this.monthValue, value)
        }
      }
    },
    handleClick (row) {
      // console.log(row)
      this.dialogVisibleP = true
      this.message = row
    },
    closeDialog (value) {
      // console.log(value)
      this.dialogVisibleP = value
    },
    editAccount () {
      this.dialogVisibleA = true
    },
    closeEditDialog (value) {
      console.log(value)
      this.dialogVisibleA = value
    },
    getNewMessage (value, close) {
      // console.log(value, close)
      // 重新获取数据更新
      this.createdMessage = value
      let len = this.newList.length
      value.id = len
      this.newList.push(value)
      this.showList = this.newList
      this.countBill(this.showList)
    }
  }
}
</script>
