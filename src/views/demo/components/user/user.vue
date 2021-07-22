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
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
    </div>
    <el-table v-bind="table" style="width: 100%"  :data='formData' @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column v-for="(item, index) in table.columns" :key="index" :prop="item.prop" :label="item.label" width="150">
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
        <el-form-item prop="qq" label="qq">
          <el-input v-model="addForm.qq" placeholder="qq" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="addForm.address" placeholder="地址" class="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addAdmin()">添加</el-button>
          <el-button type="success" @click="closeAdd()">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="updateVisible" :before-close="handleClose" width="600px">
      <el-form :model="updateForm" label-width="180px" :rules="rules">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="updateForm.username" placeholder="用户名" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="updateForm.password" placeholder="密码" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="updateForm.phone" placeholder="手机" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="qq" label="qq">
          <el-input v-model="updateForm.qq" placeholder="qq" class="input"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="updateForm.address" placeholder="地址" class="input"></el-input>
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
import { getAllUser, handleAddUser, handleDeleteUser, handleUpdateUser } from '../../../../api'
Vue.use(pluginExport)
export default {
  data: function () {
    return {
      currentPage: 1,
      addForm: {
        username: '',
        password: '',
        phone: '',
        qq: '',
        state: '',
        address: ''
      },
      updateForm: {
        id: -1,
        username: '',
        password: '',
        phone: '',
        qq: '',
        state: '',
        address: ''
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
          label: '用户名',
          prop: 'username'
        },
        {
          label: '密码',
          prop: 'password'
        },
        {
          label: '手机号',
          prop: 'phone'
        }, {
          label: 'qq',
          prop: 'qq'
        }, {
          label: 'state',
          prop: 'state'
        }, {
          label: 'address',
          prop: 'address'
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
        ],
        qq: [{
          required: true,
          message: '请输入qq号',
          trigger: 'blur'
        }, {
          min: 5,
          max: 10,
          message: '请输入5-10位qq',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '请输入地址',
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
    handleCurrentChange (val) {
      this.currentPage = val
    },
    deleteAdmin () {
      handleDeleteUser(this.deleteId).then((res) => {
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
      this.updateForm.username = admin.username
      this.updateForm.password = admin.password
      this.updateForm.phone = admin.phone
      this.updateForm.id = admin.id
      this.updateVisible = true
      this.updateForm.qq = admin.qq
      this.updateForm.address = admin.address
      this.updateForm.state = admin.state
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
      } else if (this.addForm.qq.length < 3 || this.addForm.qq.length > 10) {
        return false
      } else if (this.addForm.address.length == 0) {
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
      } else if (this.updateForm.qq.length < 3 || this.updateForm.qq.length > 10) {
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
        params.append('qq', this.addForm.qq)
        params.append('address', this.addForm.address)
        params.append('state', this.addForm.state)
        handleAddUser(params).then((res) => {
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
        params.append('qq', this.updateForm.qq)
        params.append('address', this.updateForm.address)
        params.append('state', this.updateForm.state)
        handleUpdateUser(params).then((res) => {
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
      getAllUser().then((res) => {
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
