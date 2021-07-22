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
      <el-table-column v-for="(item, index) in table.columns" :key="index" :prop="item.prop" :label="item.label">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="showDeleteAdmin(scope.row)">删除</el-button>
          <el-button type="infor" @click="showUpdateAdmin(scope.row)">修改</el-button>
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

    <el-dialog :visible.sync="flightVisible" :before-close="handleClose" width="600px">
      <el-form  label-width="180px" style="margin-left: -100px">
        <el-form-item  label="航班号">
          {{notice.flightId}}
        </el-form-item>
        <el-form-item label="推迟时间">
          <el-select placeholder="推迟时间(分)" style="width: 400px" v-model="notice.time">
            <el-option
              v-for="item in nums"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input style="width: 400px" v-model="notice.title"></el-input>
        </el-form-item>
        <el-form-item  label="信息">
          <el-input
            style="width: 400px"
            type="textarea"
            :rows="5"
            placeholder="请输入信息"
            v-model="notice.message">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="updateNotice()">修改</el-button>
          <el-button type="success" @click="closeAdd()">关闭</el-button>
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
import {
  getAllAdmin,
  getAllNotice,
  handleAddAdmin,
  handleAddNotice,
  handleDeleteAdmin, handleDeleteNotice,
  handleUpdateAdmin, handleUpdateNotice
} from '../../../../api'
Vue.use(pluginExport)
export default {
  data () {
    return {
      nums: [],
      currentPage: 1,
      addForm: {
        username: '',
        password: '',
        phone: ''
      },
      notice: {
        id: -1,
        title: '',
        flightId: -1,
        message: '',
        time: 0
      },
      addVisible: false,
      deleteVisible: false,
      flightVisible: false,
      deleteInfo: '',
      deleteId: -1,
      table: {
        columns: [{
          label: 'ID',
          prop: 'id'
        },
        {
          label: '航班号',
          prop: 'flightId'
        },
        {
          label: '推迟时间',
          prop: 'time'
        },
        {
          label: '标题',
          prop: 'title'
        }, {
          label: '消息',
          prop: 'message'
        }
        ],
        data: [],
        size: 'mini',
        stripe: true,
        border: true,
        multipleSelection: []
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '用户名应该在3-10位字符',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 40,
          message: '密码应该在3-40位字符',
          trigger: 'blur'
        }
        ],
        phone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          min: 11,
          max: 11,
          message: '手机号应为11位',
          trigger: 'blur'
        }
        ]
      }
    }
  },
  computed: {
    formData: function () {
      return this.table.data.slice((this.currentPage - 1) * 10, this.currentPage * 10)
    }
  },
  methods: {
    updateNotice () {
      const params = new URLSearchParams()
      params.append('id', this.notice.id)
      params.append('time', this.notice.time)
      params.append('title', this.notice.title)
      params.append('message', this.notice.message)
      params.append('flightId', this.notice.flightId)
      handleUpdateNotice(params).then(res => {
        this.getData()
        this.flightVisible = false
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    deleteAdmin () {
      handleDeleteNotice(this.deleteId).then((res) => {
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
      this.notice.flightId = admin.flightId
      this.notice.time = admin.time
      this.notice.title = admin.title
      this.notice.id = admin.id
      this.notice.message = admin.message
      this.flightVisible = true
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
    addAdmin () {
      if (this.validateAddForm()) {
        const params = new URLSearchParams()
        params.append('username', this.addForm.username)
        params.append('password', this.addForm.password)
        params.append('phone', this.addForm.phone)
        handleAddAdmin(params).then((res) => {
          if (res === 1) {
            this.$message({ message: '插入成功', type: 'success' })
            this.addVisible = false
            this.getData()
          } else if (res === 0) {
            this.$message({ message: '插入失败', type: 'error' })
            this.addVisible = false
            this.getData()
          }
        })
      }
    },
    updateAdmin () {
      if (this.validateUpdateForm()) {
        const params = new URLSearchParams()
        params.append('username', this.updateForm.username)
        params.append('id', this.updateForm.id)
        params.append('password', this.updateForm.password)
        params.append('phone', this.updateForm.phone)
        handleUpdateAdmin(params).then((res) => {
          // eslint-disable-next-line eqeqeq
          if (res == 1) {
            this.$message({ message: res.msg, type: 'success' })
            this.updateVisible = false
            this.getData()
            // eslint-disable-next-line eqeqeq
          } else if (res == 0) {
            this.$message({ message: res.msg, type: 'error' })
            this.updateVisible = false
            this.getData()
          }
        })
      }
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
      for (var i = 1; i <= 120; i++) {
        this.nums.push(i)
      }
      getAllNotice().then((res) => {
        this.table.data = res
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style>
  .input {
    width: 280px;
  }
</style>
