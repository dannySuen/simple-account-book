import Vue from 'vue'
import {Row, Col, Button, Select, Option, DatePicker, Table, TableColumn, Dialog, Input, MessageBox, Message} from 'element-ui'
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Input)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
