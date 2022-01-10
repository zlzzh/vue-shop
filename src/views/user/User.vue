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
      <!-- 卡片头部  搜索、新增用户 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="regainGetUserList"
            v-model="searchStr"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUserClick(searchStr)"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6"
          ><el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 添加用户的对话框 -->
      <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%">
        <!-- 对话框主体区域 -->
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
        <!-- 对话框底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm('addForm')">取 消</el-button>
          <el-button type="primary" @click="sureToAdd">确 定</el-button>
        </span>
      </el-dialog>
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
        <el-table-column prop="username" label="姓名"> </el-table-column>
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
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row)"
            ></el-button>
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
  </div>
</template>

<script>
import {
  getUserList,
  updateUserState,
  addUserInfo,
  deleteUserInfoById,
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
      // 头部搜索 v-model
      searchStr: "",
      // 是否显示对话框 默认false
      dialogVisible: false,
      // 新增用户表单 v-model
      form: {
        username: "",
        email: "",
        mobile: "",
      },
      // 表单验证规格 rules
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

      // 当前所在页数
      currentPage: 1,
      // 当前每页显示多少条数据
      pageSize: 4,
      // 用户列表
      userList: [],
    };
  },
  methods: {
    // 清空input输入框触发
    searchUserClick(info) {
      // 这里应该有接口的 目前就用获取的userList代替数据了
      let a = [];
      a = this.userList.filter((item) => item.username === info);
      this.userList = a;
      if(info === '') {
        this.regainGetUserList()
      }
    },
    // 重新获取用户列表  regain：重新获取
    async regainGetUserList() {
      const { data } = await getUserList();
      // console.log(data.data.users);
      // 这里需要格外注意下  switch开关绑定的是布尔值，所以需要把后台的“ture”转成布尔值，否则都为false
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
    // 取消
    cancelForm(from) {
      // 隐藏对话框
      this.dialogVisible = false;
      // 重置填写的信息
      this.$refs[from].resetFields();
    },
    // 确定
    sureToAdd() {
      // 预校验 通过$refs.addForm取到表单
      this.$refs.addForm.validate((val) => {
        // 如果val === true 验证成功 发送post请求
        if (val) {
          // 隐藏对话框
          this.dialogVisible = false;
          // 发送新增用户请求
          addUserInfo(
            this.form.username,
            this.form.email,
            this.form.mobile
          ).then((res) => {
            // 添加成功
            if (res.data.code === 200) {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
            } else {
              // 添加失败
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
            }
          });
          // 添加成功后重新发送获取数据请求 刷新数据
          this.regainGetUserList();
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
    // 删除用户数据
    removeUserById(scope) {
      this.$confirm("删除当前用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUserInfoById(scope.Id).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
              });
              // 删除成功后 需要刷新列表 即：重新发送获取用户列表请求
              this.regainGetUserList();
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.regainGetUserList();
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
