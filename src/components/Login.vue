<template>
  <div class="log_container">
    <div class="log_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="log_form"
        :rules="rules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="用户名"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="el-icon-view"
            clearable
            show-password
            v-model="loginForm.password"
            @keyup.enter.native="login_btn"
          ></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login_btn">登录</el-button>
          <el-button type="info" @click="reset_info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sendLogin } from "@/api/log/login";
export default {
  name: "",
  components: {},
  data() {
    return {
      //   表单数据绑定 model
      loginForm: {
        username: "",
        password: "",
      },
      //   表单校验规则
      rules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login_btn() {
      console.log(this.loginForm.username, this.loginForm.password);
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          sendLogin(this.loginForm.username, this.loginForm.password).then(
            (res) => {
              console.log(res.data);
              if (res.data.code === 400) {
                this.$message({
                  showClose: true,
                  message: "用户名或密码不正确",
                  type: "error",
                });
              } else {
                this.$message({
                  showClose: true,
                  message: "登录成功",
                  type: "success",
                });
                //1.登录成功后 把服务器返回的token保存到本地的sessionStorage中
                 window.sessionStorage.setItem('token',res.data.token)
                //2.登录成功后 跳转到/home 页面
                this.$router.push('/home')
              }
            }
          );
        } else {
          console.log("弹窗提示");
        }
      });
    },
    // 重置表单 elementUI封装的resetFields方法
    reset_info() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>

<style scoped>
.log_container {
  background-color: #2b4b6b;
  height: 100%;
}
.log_box {
  position: fixed;
  width: 450px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
}
.avatar_box {
  width: 70px;
  height: 70px;
  border: 2px solid #bebebe;
  background-color: #fff;
  border-radius: 50%;
  padding: 5px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0, 0, 10px;
}
.avatar_box img {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #f0f0f0;
}
.log_form {
  position: absolute;
  top: 80px;
  left: 25px;
  right: 25px;
}
.btns {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>

