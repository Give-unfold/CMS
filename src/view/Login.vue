<template>
  <div class="login">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/vue.svg" alt="" />
      </div>
      <el-form
        ref="ruleFormRef"
        class="demo-ruleForm"
        :model="parmas"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="parmas.username"
            size="large"
            :prefix-icon="User"
            @input="usernameInput"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="parmas.password"
            type="password"
            size="large"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" size="large" @click="loginTo"
            >登录</el-button
          >
          <el-button type="info" size="large" @click="restData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { reqLogin } from "../axios/Api";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  setup() {
    const parmas = reactive({
      username: "",
      password: "",
    });

    const rules = reactive({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
      ],
    });

    // 重置表单
    const ruleFormRef = ref(null);
    function restData() {
      ruleFormRef.value.resetFields();
    }

    // 登录按钮
    const router = useRouter();
    function loginTo() {
      ruleFormRef.value.validate(async (flag) => {
        if (!flag) return ElMessage.error("请输入正确的用户名及密码");
        const { data, meta } = await reqLogin(parmas);
        if (meta.status != 200) return;
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userInfo", JSON.stringify(data));
        router.push("/welcome");
      });
    }

    function usernameInput(value) {
      // console.log(data.username);
    }

    return {
      parmas,
      rules,
      User,
      Lock,
      usernameInput,
      restData,
      ruleFormRef,
      loginTo,
    };
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #1a4c6b;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #eeeeee;
      height: 142px;
      width: 142px;
      border-radius: 50%;
      border: 10px solid white;
      box-shadow: 0 0 10px #ddd;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .demo-ruleForm {
      margin-top: 120px;
      padding: 0 20px;
      .btns {
        float: right;
      }
    }
  }
}
</style>