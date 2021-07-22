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
      <el-button type="primary" @click="handleAdd">添加航班</el-button>
    </div>
    <el-table v-bind="table" style="width: 100%"  :data='formData' @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column v-for="(item, index) in table.columns" :key="index" :prop="item.prop" :label="item.label" width="110">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="showDeleteAdmin(scope.row)">删除</el-button>
          <el-button type="info" @click="drawMap(scope.row)">查看路线</el-button>
          <el-button type="primary" @click="showNotice(scope.row)">发布公告</el-button>
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
        <el-form-item prop="dcity" label="出发地">
          <el-select v-model="addForm.dcity" filterable placeholder="出发地">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dcity" label="到达地">
          <el-select v-model="addForm.acity" filterable placeholder="到达地">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="date" label="日期">
          <el-date-picker
            v-model="addForm.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
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
          <el-button type="success" @click="addNotice()">添加</el-button>
          <el-button type="success" @click="closeAdd()">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="updateVisible" :before-close="handleClose" width="600px">
      <div style="height: 300px" id="flightmap">正在马不停蹄的画图</div>
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
import 'echarts/map/js/china.js'
import Vue from 'vue'
import pluginExport from '@d2-projects/vue-table-export'
import { getAllFlight, handleAddFlight, handleAddNotice, handleDeleteFlight } from '../../../../api'
Vue.use(pluginExport)
export default {
  data: function () {
    return {
      flightVisible: false,
      notice: {
        title: '',
        flightId: -1,
        message: '',
        time: 0
      },
      nums: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      options: [{ value: '阿尔山', label: '阿尔山' }, { value: '阿克苏', label: '阿克苏' }, { value: '阿拉善右旗', label: '阿拉善右旗' }, { value: '阿拉善左旗', label: '阿拉善左旗' }, { value: '阿勒泰', label: '阿勒泰' }, { value: '阿里', label: '阿里' }, { value: '澳门', label: '澳门' }, { value: '安庆', label: '安庆' }, { value: '安顺', label: '安顺' }, { value: '鞍山', label: '鞍山' }, { value: '巴彦淖尔', label: '巴彦淖尔' }, { value: '百色', label: '百色' }, { value: '包头', label: '包头' }, { value: '保山', label: '保山' }, { value: '北海', label: '北海' }, { value: '北京', label: '北京' }, { value: '白城', label: '白城' }, { value: '白山', label: '白山' }, { value: '毕节', label: '毕节' }, { value: '博乐', label: '博乐' }, { value: '重庆', label: '重庆' }, { value: '昌都', label: '昌都' }, { value: '常德', label: '常德' }, { value: '常州', label: '常州' }, { value: '朝阳', label: '朝阳' }, { value: '成都', label: '成都' }, { value: '池州', label: '池州' }, { value: '赤峰', label: '赤峰' }, { value: '揭阳', label: '揭阳' }, { value: '长春', label: '长春' }, { value: '长沙', label: '长沙' }, { value: '长治', label: '长治' }, { value: '承德', label: '承德' }, { value: '沧源', label: '沧源' }, { value: '达县', label: '达县' }, { value: '大理', label: '大理' }, { value: '大连', label: '大连' }, { value: '大庆', label: '大庆' }, { value: '大同', label: '大同' }, { value: '丹东', label: '丹东' }, { value: '稻城', label: '稻城' }, { value: '东营', label: '东营' }, { value: '敦煌', label: '敦煌' }, { value: '芒市', label: '芒市' }, { value: '额济纳旗', label: '额济纳旗' }, { value: '鄂尔多斯', label: '鄂尔多斯' }, { value: '恩施', label: '恩施' }, { value: '二连浩特', label: '二连浩特' }, { value: '佛山', label: '佛山' }, { value: '福州', label: '福州' }, { value: '抚远', label: '抚远' }, { value: '阜阳', label: '阜阳' }, { value: '赣州', label: '赣州' }, { value: '格尔木', label: '格尔木' }, { value: '固原', label: '固原' }, { value: '广元', label: '广元' }, { value: '广州', label: '广州' }, { value: '贵阳', label: '贵阳' }, { value: '桂林', label: '桂林' }, { value: '哈尔滨', label: '哈尔滨' }, { value: '哈密', label: '哈密' }, { value: '海口', label: '海口' }, { value: '海拉尔', label: '海拉尔' }, { value: '邯郸', label: '邯郸' }, { value: '汉中', label: '汉中' }, { value: '杭州', label: '杭州' }, { value: '合肥', label: '合肥' }, { value: '和田', label: '和田' }, { value: '黑河', label: '黑河' }, { value: '呼和浩特', label: '呼和浩特' }, { value: '淮安', label: '淮安' }, { value: '怀化', label: '怀化' }, { value: '黄山', label: '黄山' }, { value: '惠州', label: '惠州' }, { value: '鸡西', label: '鸡西' }, { value: '济南', label: '济南' }, { value: '济宁', label: '济宁' }, { value: '加格达奇', label: '加格达奇' }, { value: '佳木斯', label: '佳木斯' }, { value: '嘉峪关', label: '嘉峪关' }, { value: '金昌', label: '金昌' }, { value: '金门', label: '金门' }, { value: '锦州', label: '锦州' }, { value: '嘉义', label: '嘉义' }, { value: '西双版纳', label: '西双版纳' }, { value: '建三江', label: '建三江' }, { value: '晋江', label: '晋江' }, { value: '井冈山', label: '井冈山' }, { value: '景德镇', label: '景德镇' }, { value: '九江', label: '九江' }, { value: '九寨沟', label: '九寨沟' }, { value: '喀什', label: '喀什' }, { value: '凯里', label: '凯里' }, { value: '康定', label: '康定' }, { value: '克拉玛依', label: '克拉玛依' }, { value: '库车', label: '库车' }, { value: '库尔勒', label: '库尔勒' }, { value: '昆明', label: '昆明' }, { value: '拉萨', label: '拉萨' }, { value: '兰州', label: '兰州' }, { value: '黎平', label: '黎平' }, { value: '丽江', label: '丽江' }, { value: '荔波', label: '荔波' }, { value: '连云港', label: '连云港' }, { value: '六盘水', label: '六盘水' }, { value: '临汾', label: '临汾' }, { value: '林芝', label: '林芝' }, { value: '临沧', label: '临沧' }, { value: '临沂', label: '临沂' }, { value: '柳州', label: '柳州' }, { value: '泸州', label: '泸州' }, { value: '洛阳', label: '洛阳' }, { value: '吕梁', label: '吕梁' }, { value: '澜沧', label: '澜沧' }, { value: '龙岩', label: '龙岩' }, { value: '满洲里', label: '满洲里' }, { value: '梅州', label: '梅州' }, { value: '绵阳', label: '绵阳' }, { value: '漠河', label: '漠河' }, { value: '牡丹江', label: '牡丹江' }, { value: '马祖', label: '马祖' }, { value: '南昌', label: '南昌' }, { value: '南充', label: '南充' }, { value: '南京', label: '南京' }, { value: '南宁', label: '南宁' }, { value: '南通', label: '南通' }, { value: '南阳', label: '南阳' }, { value: '宁波', label: '宁波' }, { value: '宁蒗', label: '宁蒗' }, { value: '攀枝花', label: '攀枝花' }, { value: '普洱', label: '普洱' }, { value: '齐齐哈尔', label: '齐齐哈尔' }, { value: '黔江', label: '黔江' }, { value: '且末', label: '且末' }, { value: '秦皇岛', label: '秦皇岛' }, { value: '青岛', label: '青岛' }, { value: '庆阳', label: '庆阳' }, { value: '衢州', label: '衢州' }, { value: '日喀则', label: '日喀则' }, { value: '日照', label: '日照' }, { value: '三亚', label: '三亚' }, { value: '厦门', label: '厦门' }, { value: '上海', label: '上海' }, { value: '深圳', label: '深圳' }, { value: '神农架', label: '神农架' }, { value: '沈阳', label: '沈阳' }, { value: '石家庄', label: '石家庄' }, { value: '塔城', label: '塔城' }, { value: '台州', label: '台州' }, { value: '太原', label: '太原' }, { value: '扬州', label: '扬州' }, { value: '唐山', label: '唐山' }, { value: '腾冲', label: '腾冲' }, { value: '天津', label: '天津' }, { value: '天水', label: '天水' }, { value: '通辽', label: '通辽' }, { value: '铜仁', label: '铜仁' }, { value: '吐鲁番', label: '吐鲁番' }, { value: '万州', label: '万州' }, { value: '威海', label: '威海' }, { value: '潍坊', label: '潍坊' }, { value: '温州', label: '温州' }, { value: '文山', label: '文山' }, { value: '乌海', label: '乌海' }, { value: '乌兰浩特', label: '乌兰浩特' }, { value: '乌鲁木齐', label: '乌鲁木齐' }, { value: '无锡', label: '无锡' }, { value: '梧州', label: '梧州' }, { value: '武汉', label: '武汉' }, { value: '武夷山', label: '武夷山' }, { value: '西安', label: '西安' }, { value: '西昌', label: '西昌' }, { value: '西宁', label: '西宁' }, { value: '锡林浩特', label: '锡林浩特' }, { value: '香格里拉(迪庆)', label: '香格里拉(迪庆)' }, { value: '襄阳', label: '襄阳' }, { value: '兴义', label: '兴义' }, { value: '徐州', label: '徐州' }, { value: '香港', label: '香港' }, { value: '烟台', label: '烟台' }, { value: '延安', label: '延安' }, { value: '延吉', label: '延吉' }, { value: '盐城', label: '盐城' }, { value: '伊春', label: '伊春' }, { value: '伊宁', label: '伊宁' }, { value: '宜宾', label: '宜宾' }, { value: '宜昌', label: '宜昌' }, { value: '宜春', label: '宜春' }, { value: '义乌', label: '义乌' }, { value: '银川', label: '银川' }, { value: '永州', label: '永州' }, { value: '榆林', label: '榆林' }, { value: '玉树', label: '玉树' }, { value: '运城', label: '运城' }, { value: '湛江', label: '湛江' }, { value: '张家界', label: '张家界' }, { value: '张家口', label: '张家口' }, { value: '张掖', label: '张掖' }, { value: '昭通', label: '昭通' }, { value: '郑州', label: '郑州' }, { value: '中卫', label: '中卫' }, { value: '舟山', label: '舟山' }, { value: '珠海', label: '珠海' }, { value: '遵义(茅台)', label: '遵义(茅台)' }, { value: '遵义(新舟)', label: '遵义(新舟)' }],
      currentPage: 1,
      addForm: {
        dcity: '',
        acity: '',
        date: ''
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
          label: '航空公司',
          prop: 'airline'
        },
        {
          label: '航班号',
          prop: 'flightNumber'
        },
        {
          label: '出发时间',
          prop: 'departureDate'
        }, {
          label: '到达时间',
          prop: 'arrivalDate'
        }, {
          label: '出发地',
          prop: 'dicty'
        }, {
          label: '到达地',
          prop: 'acity'
        }, {
          label: '日期',
          prop: 'date'
        }
        ],
        data: [],
        size: 'mini',
        stripe: true,
        border: true,
        multipleSelection: []
      },
      rules: {
        dcity: [{
          required: true,
          message: '请选择出发城市',
          trigger: 'blur'
        }
        ],
        acity: [{
          required: true,
          message: '请选择到达城市',
          trigger: 'blur'
        }
        ],
        date: [{
          required: true,
          message: '请选择日期',
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

    addNotice () {
      console.log(this.notice)
      const params = new URLSearchParams()
      params.append('flightId', this.notice.flightId)
      params.append('time', this.notice.time)
      params.append('title', this.notice.title)
      params.append('message', this.notice.message)
      handleAddNotice(params).then(res => {
        this.$message.success('发布成功')
        this.flightVisible=false
      })
    },
    'handleCurrentChange' (val) {
      this.currentPage = val
    },
    'deleteAdmin' () {
      handleDeleteFlight(this.deleteId).then((res) => {
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

    'showDeleteAdmin' (admin) {
      this.deleteId = admin.id
      this.deleteInfo = admin.username
      this.deleteVisible = true
    },
    'validateAddForm' () {
      if (this.addForm.dcity == '') {
        return false
      } else if (this.addForm.acity == '') {
        return false
      } else if (this.addForm.date == '') {
        return false
      }
      return true
    },

    'addAdmin' () {
      console.log(this.addForm)
      if (this.validateAddForm()) {
        const params = new URLSearchParams()
        params.append('dicty', this.addForm.dcity)
        params.append('acity', this.addForm.acity)
        params.append('date', this.addForm.date)
        handleAddFlight(params).then((res) => {
          if (res !== null || res.size !== 0) {
            this.$message({ message: '插入成功', type: 'success' })
            this.addVisible = false
            this.getData()
          } else {
            this.$message({ message: '插入失败', type: 'error' })
            this.addVisible = false
            this.getData()
          }
        })
      } else {
        this.$message.error('请输入正确信息')
      }
    },
    showNotice (item) {
      this.notice.flightId = item.id
      this.flightVisible = true
    },
    'drawMap' (item) {
      console.log(item)
      this.updateVisible = true
      const map = document.getElementById('flightmap')
      setTimeout(() => {
        const myChart = this.$echart.init(document.getElementById('flightmap'))
        var geoCoordMap = {
          上海: [121.4648, 31.2891],
          东莞: [113.8953, 22.901],
          东营: [118.7073, 37.5513],
          中山: [113.4229, 22.478],
          临汾: [111.4783, 36.1615],
          临沂: [118.3118, 35.2936],
          丹东: [124.541, 40.4242],
          丽水: [119.5642, 28.1854],
          乌鲁木齐: [87.9236, 43.5883],
          佛山: [112.8955, 23.1097],
          保定: [115.0488, 39.0948],
          兰州: [103.5901, 36.3043],
          包头: [110.3467, 41.4899],
          北京: [116.4551, 40.2539],
          北海: [109.314, 21.6211],
          南京: [118.8062, 31.9208],
          南宁: [108.479, 23.1152],
          南昌: [116.0046, 28.6633],
          南通: [121.1023, 32.1625],
          厦门: [118.1689, 24.6478],
          台州: [121.1353, 28.6688],
          合肥: [117.29, 32.0581],
          呼和浩特: [111.4124, 40.4901],
          咸阳: [108.4131, 34.8706],
          哈尔滨: [127.9688, 45.368],
          唐山: [118.4766, 39.6826],
          嘉兴: [120.9155, 30.6354],
          大同: [113.7854, 39.8035],
          大连: [122.2229, 39.4409],
          天津: [117.4219, 39.4189],
          太原: [112.3352, 37.9413],
          威海: [121.9482, 37.1393],
          宁波: [121.5967, 29.6466],
          宝鸡: [107.1826, 34.3433],
          宿迁: [118.5535, 33.7775],
          常州: [119.4543, 31.5582],
          广州: [113.5107, 23.2196],
          廊坊: [116.521, 39.0509],
          延安: [109.1052, 36.4252],
          张家口: [115.1477, 40.8527],
          徐州: [117.5208, 34.3268],
          德州: [116.6858, 37.2107],
          惠州: [114.6204, 23.1647],
          成都: [103.9526, 30.7617],
          扬州: [119.4653, 32.8162],
          承德: [117.5757, 41.4075],
          拉萨: [91.1865, 30.1465],
          无锡: [120.3442, 31.5527],
          日照: [119.2786, 35.5023],
          昆明: [102.9199, 25.4663],
          杭州: [119.5313, 29.8773],
          枣庄: [117.323, 34.8926],
          柳州: [109.3799, 24.9774],
          株洲: [113.5327, 27.0319],
          武汉: [114.3896, 30.6628],
          汕头: [117.1692, 23.3405],
          江门: [112.6318, 22.1484],
          沈阳: [123.1238, 42.1216],
          沧州: [116.8286, 38.2104],
          河源: [114.917, 23.9722],
          泉州: [118.3228, 25.1147],
          泰安: [117.0264, 36.0516],
          泰州: [120.0586, 32.5525],
          济南: [117.1582, 36.8701],
          济宁: [116.8286, 35.3375],
          海口: [110.3893, 19.8516],
          淄博: [118.0371, 36.6064],
          淮安: [118.927, 33.4039],
          深圳: [114.5435, 22.5439],
          清远: [112.9175, 24.3292],
          温州: [120.498, 27.8119],
          渭南: [109.7864, 35.0299],
          湖州: [119.8608, 30.7782],
          湘潭: [112.5439, 27.7075],
          滨州: [117.8174, 37.4963],
          潍坊: [119.0918, 36.524],
          烟台: [120.7397, 37.5128],
          玉溪: [101.9312, 23.8898],
          珠海: [113.7305, 22.1155],
          盐城: [120.2234, 33.5577],
          盘锦: [121.9482, 41.0449],
          石家庄: [114.4995, 38.1006],
          福州: [119.4543, 25.9222],
          秦皇岛: [119.2126, 40.0232],
          绍兴: [120.564, 29.7565],
          聊城: [115.9167, 36.4032],
          肇庆: [112.1265, 23.5822],
          舟山: [122.2559, 30.2234],
          苏州: [120.6519, 31.3989],
          莱芜: [117.6526, 36.2714],
          菏泽: [115.6201, 35.2057],
          营口: [122.4316, 40.4297],
          葫芦岛: [120.1575, 40.578],
          衡水: [115.8838, 37.7161],
          衢州: [118.6853, 28.8666],
          西宁: [101.4038, 36.8207],
          西安: [109.1162, 34.2004],
          贵阳: [106.6992, 26.7682],
          连云港: [119.1248, 34.552],
          邢台: [114.8071, 37.2821],
          邯郸: [114.4775, 36.535],
          郑州: [113.4668, 34.6234],
          鄂尔多斯: [108.9734, 39.2487],
          重庆: [107.7539, 30.1904],
          金华: [120.0037, 29.1028],
          铜川: [109.0393, 35.1947],
          银川: [106.3586, 38.1775],
          镇江: [119.4763, 31.9702],
          长春: [125.8154, 44.2584],
          长沙: [113.0823, 28.2568],
          长治: [112.8625, 36.4746],
          阳泉: [113.4778, 38.0951],
          青岛: [120.4651, 36.3373],
          韶关: [113.7964, 24.7028]
        }

        var BJData = [
          [{
            name: item.dicty
          }, {
            name: item.acity
          }]
        ]

        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'

        var convertData = function (data) {
          var res = []
          for (var i = 0; i < data.length; i++) {
            var dataItem = data[i]
            var fromCoord = geoCoordMap[dataItem[0].name]
            var toCoord = geoCoordMap[dataItem[1].name]
            if (fromCoord && toCoord) {
              res.push([{
                coord: fromCoord
              }, {
                coord: toCoord
              }])
            }
          }
          return res
        }

        var color = ['#00BFFF', '#48D1CC', '#FFD700']
        var series = [];
        [
          ['成都', BJData]
        ].forEach(function (item, i) {
          series.push({
            name: ' 分公司',
            type: 'lines',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          }, {
            name: ' 分公司',
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.4,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          }, {
            name: ' 分公司',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: function (val) {
              return val[2] / 8
            },
            itemStyle: {
              normal: {
                color: color[i]
              }
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              }
            })
          })
        })

        const options = {
          backgroundColor: '#FFFFFF',
          title: {
            text: '航班路线',
            subtext: '数据为携程数据',
            left: 'center',
            textStyle: {
              color: '#808080',
              size: '20px'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data: ['总公司'],
            textStyle: {
              color: '#fff'
            },
            selectedMode: 'single'
          },
          geo: {
            map: 'china',
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#FFFAF0',
                borderColor: '#191970'
              },
              emphasis: {
                areaColor: '#F5F5F5'
              }
            }
          },
          series: series
        }

        myChart.setOption(options)
      }, 1000)
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
      getAllFlight().then((res) => {
        this.table.data = res
      })
      for (var i = 1; i <= 120; i++) {
        this.nums.push(i)
      }
    }
  },
  created () {
    this.getData()
  },
  mounted () {
  }
}
</script>

<style>
  .input {
    width: 280px;
  }
</style>
