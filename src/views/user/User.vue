<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card" shadow="always">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getUserList1"
            v-model="searchInfo"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchInfoBtn(searchInfo)"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格数据区域 -->
      <!-- 对数据请求的处理，最为重要的一句 userList.slice((currentPage-1)*pageSize,currentPage*pageSize) -->
      <el-table
        :data="
          userList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        style="width: 100%"
        :border="true"
        stripe
      >
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽  -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" class="setting" width="210px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-star-off"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- Pagination 分页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 4]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.length"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%">
      <!-- 主体区域 -->
      <el-form :model="form" :rules="rules" ref="addForm">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="80px" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="addUserInfo1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  updateUserState,
  addUserInfo,
} from "../../api/users/user";
export default {
  name: "user",
  components: {},
  data() {
    // 自定义手机号验证规则  正则表达式
    var checkMobile = function (rule, value, callback) {
      if (value === "") {
        callback(new Error("手机号不能为空"));
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      //  搜索
      searchInfo: "",
      //  是否显示对话框 默认false
      dialogVisible: false,
      form: {
        Id: "",
        create_time: "",
        email: "",
        mg_state: "",
        mobile: "",
        role_name: "",
        type: "",
        username: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [{ required: true, validator: checkMobile, trigger: "blur" }],
      },

      //  当前所在页数
      currentPage: 1,
      // 当前每页显示多少条数据
      pageSize: 4,
      userList: [],
    };
  },
  methods: {
    searchInfoBtn(info) {
      let a = [];
      a = this.userList.filter((item) => item.username === info);
      this.userList = a;
    },
    async getUserList1() {
      const { data } = await getUserList();
      console.log(data.data.users);
      // *******************这里需要格外注意下  switch开关绑定的是布尔值，所以需要把后台的“ture”转成布尔值，否则都为false
      const a = data.data.users;
      a.forEach((item) => {
        if (item.mg_state === "true") {
          item.mg_state = true;
        } else {
          item.mg_state = false;
        }
      });
      this.userList = a;
    },
    addUserInfo1() {
      // 预校验
      this.$refs.addForm.validate((val) => {
        if (val) {
          // 隐藏对话框
          this.dialogVisible = false;
          // 发送新增用户请求
          addUserInfo(
            this.form.username,
            this.form.email,
            this.form.mobile
          ).then((res) => {
            // console.log(res);
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success",
            });
          });
          // 添加成功后重新发送获取数据请求 刷新数据
          this.getUserList1();
        } else {
          this.$message({
            message: "请填写正确的用户信息",
            type: "warning",
          });
        }
      });
    },
    // switch 开关改变时触发事件
    async userStateChanged(userInfo) {
      // 发送put 请求 修改用户状态mg_state
      console.log(userInfo.Id, userInfo.mg_state);
      updateUserState(userInfo.Id, userInfo.mg_state).then((res) => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: "修改失败",
          });
          // 如果修改失败 需要把页面修改完的再改回去
          userInfo.mg_state = !userInfo.mg_state;
        }
      });
    },
    // 修改每页显示几条时触发
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
    },
    // 修改显示跳转第几页时触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    // 对话框取消按钮
    cancelForm(from) {
      // 隐藏对话框
      this.dialogVisible = false;
      // 重置填写的信息
      this.$refs[from].resetFields();
    },
  },
  created() {
    this.getUserList1();
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  /* box-shadow: 0 0 5px 1px #333744 */
}
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
