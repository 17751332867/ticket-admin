<template>
  <d2-container type="card">
    <template slot="header">导出表格</template>
    <div class="d2-mb">
      <el-button type="primary" @click="exportCsv">
        <d2-icon name="download" />
        导出 CSV
      </el-button>
      <el-button type="primary" @click="exportExcel">
        <d2-icon name="download" />
        导出 Excel
      </el-button>
    </div>
    <el-table v-bind="table" style="width: 100%"  :data='formData' @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column v-for="(item, index) in table.columns" :key="index" :prop="item.prop" :label="item.label" width="140">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="showDeleteAdmin(scope.row)">删除</el-button>
          <el-button type="infor" @click="showUpdateAdmin(scope.row)">修改</el-button>
          <el-button type="info" v-show="isIn(scope.row.id)" @click="handleaddPush(scope.row.id)">添加推送</el-button>
          <el-button type="primary" v-show="!isIn(scope.row.id)" @click="handledeletePush(scope.row.id)">取消推送</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        :page-size="10"
        :pager-count="11"
        layout="prev, pager, next"
        :total="table.data.length"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog :visible.sync="addVisible" :before-close="handleClose" width="600px">
      <el-form :model="addForm" label-width="180px" :rules="rules">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addForm.username" placeholder="用户名" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addForm.password" placeholder="密码" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="addForm.phone" placeholder="手机" class="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addAdmin()">添加</el-button>
          <el-button type="success" @click="closeAdd()">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateVisible" :before-close="handleClose" width="600px">
      <el-form :model="updateForm" label-width="180px" :rules="rules">
        <el-form-item prop="type" label="类型">
          <el-input v-model="updateForm.type" placeholder="类型" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="类型">
          <el-input v-model="updateForm.price" placeholder="价格" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="punctualityRate" label="打折率">
          <el-input-number v-model="updateForm.punctualityRate" :min="1" :max="100" label="打折率"></el-input-number>
        </el-form-item>
        <el-form-item prop="flightId" label="航班id">
          <el-input v-model="updateForm.flightId" :disabled="true" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="total" label="总量">
          <el-input-number v-model="updateForm.total" @change="handleChange" :min="1" :max="1000" label="打折率"></el-input-number>
        </el-form-item>
        <el-form-item prop="remain" label="总量">
          <el-input-number v-model="updateForm.remain" :min="1" :max="1000" label="打折率" :disabled="true"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="updateAdmin">修改</el-button>
          <el-button type="success" @click="updateVisible=false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="deleteVisible" :before-close="handleClose">
      <span>您确定要删除用户{{deleteInfo}}吗?</span>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="deleteVisible = false">取 消</el-button>
			    <el-button type="primary" @click="deleteAdmin()">确 定</el-button>
			  </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import pluginExport from '@d2-projects/vue-table-export'
import { addPush, deletePush, getAllPush, getAllTicket, handleUpdateTicket } from '../../../../api'
Vue.use(pluginExport)
export default {
  data () {
    return {
      push: [],
      currentPage: 1,
      addForm: {
        username: '',
        password: '',
        phone: ''
      },
      updateForm: {
        id: -1,
        type: '',
        price: -1,
        punctualityRate: '',
        flightId: -1,
        total: -1,
        remain: -1
      },
      addVisible: false,
      deleteVisible: false,
      updateVisible: false,
      deleteInfo: '',
      deleteId: -1,
      table: {
        columns: [{
          label: 'ID',
          prop: 'id'
        },
        {
          label: '类型',
          prop: 'type'
        },
        {
          label: '价格',
          prop: 'price'
        },
        {
          label: '打折率',
          prop: 'punctualityRate'
        }, {
          label: '航班id',
          prop: 'flightId'
        }, {
          label: '总量',
          prop: 'total'
        }, {
          label: '剩余',
          prop: 'remain'
        }
        ],
        data: [],
        size: 'mini',
        stripe: true,
        border: true,
        multipleSelection: []
      },
      rules: {
        type: [{
          required: true,
          message: '请输入类型',
          trigger: 'blur'
        }
        ],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }
        ],
        punctualityRate: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }
        ],
        total: [{
          required: true,
          message: '请输入总量',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    formData: function () {
      return this.table.data.slice((this.currentPage - 1) * 10, this.currentPage * 10)
    }
  },
  methods: {
    handledeletePush (id) {
      deletePush(id).then(res => {
        this.$message.success('删除成功')
        this.getPush()
      })
    },
    isIn (id) {
      // eslint-disable-next-line eqeqeq
      return this.push.indexOf(id) == -1
    },
    handleaddPush (id) {
      addPush(id).then(res => {
        this.$message.success('添加成功')
        this.getPush()
      })
    },
    handleChange (curval, oldval) {
      this.updateForm.remain += curval - oldval
      console.log(this.updateForm.remain)
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    deleteAdmin () {
      handleDeleteAdmin(this.deleteId).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res == 1) {
          this.$message({ message: '删除成功', type: 'success' })
          this.deleteVisible = false
          this.getData()
          // eslint-disable-next-line eqeqeq
        } else if (res == 0) {
          this.$message({ message: '删除失败', type: 'error' })
          this.addVisible = false
          this.getData()
        }
      })
    },
    showUpdateAdmin (admin) {
      this.updateForm.type = admin.type
      this.updateForm.punctualityRate = parseInt(admin.punctualityRate.split('%')[0])
      this.updateForm.price = admin.price
      this.updateForm.flightId = admin.flightId
      this.updateForm.total = admin.total
      this.updateForm.remain = admin.remain
      this.updateForm.id = admin.id
      this.updateVisible = true
    },
    showDeleteAdmin (admin) {
      this.deleteId = admin.id
      this.deleteInfo = admin.username
      this.deleteVisible = true
    },
    validateAddForm () {
      if (this.addForm.phone.length != 11) {
        return false
      } else if (this.addForm.username.length < 3 || this.addForm.username.length > 10) {
        return false
      } else if (this.addForm.password.length < 3 || this.addForm.password.length > 40) {
        return false
      }
      return true
    },
    validateUpdateForm () {
      if (this.updateForm.phone.length != 11) {
        return false
      } else if (this.updateForm.username.length < 3 || this.updateForm.username.length > 10) {
        return false
      } else if (this.updateForm.password.length < 3 || this.updateForm.password.length > 40) {
        return false
      }
      return true
    },
    updateAdmin () {
      const params = new URLSearchParams()
      params.append('id', this.updateForm.id)
      params.append('type', this.updateForm.type)
      params.append('price', this.updateForm.price)
      params.append('punctualityRate', this.updateForm.punctualityRate)
      params.append('flightId', this.updateForm.flightId)
      params.append('total', this.updateForm.total)
      params.append('remain', this.updateForm.remain)
      handleUpdateTicket(params).then((res) => {
        if (res === 1) {
          this.$message({ message: '修改成功', type: 'success' })
          this.updateVisible = false
          this.getData()
        } else if (res === 0) {
          this.$message({ message: '修改失败', type: 'error' })
          this.updateVisible = false
          this.getData()
        }
      })
    },
    exportCsv (params = {}) {
      this.$export.csv({
        columns: this.table.columns,
        data: this.table.data
      })
        .then(() => {
          this.$message('导出CSV成功')
        })
    },
    exportExcel () {
      this.$export.excel({
        columns: this.table.columns,
        data: this.table.data,
        header: '导出 Excel',
        merges: ['A1', 'E1']
      })
        .then(() => {
          this.$message('导出表格成功')
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleAdd () {
      this.addVisible = true
    },
    closeAdd () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.addVisible = false
        })
        .catch(_ => {})
    },
    getData () {
      getAllTicket().then((res) => {
        this.table.data = res
      })
    },
    getPush () {
      getAllPush().then(res => {
        this.push = res
        console.log(this.push.indexOf(2872))
      })
    }
  },
  created () {
    this.getData()
    this.getPush()
  }
}
</script>

<style>
  .input {
    width: 280px;
  }
</style>
