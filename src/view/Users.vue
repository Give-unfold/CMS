<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片区域 -->
    <el-card>
      <!-- 搜索及添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            v-model="parmas.query"
            placeholder="请输入内容"
            size="large"
            clearable
            @clear="searchClear"
          >
            <template #append>
              <el-button :icon="Search" @click="getUserList()" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="large" @click="addUsers({})"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        size="small"
        border
        :data="fromTableData.tableData"
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column type="index" label="#" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.mg_state" @change="switchClick(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                :icon="Edit"
                size="small"
                @click="addUsers(row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="deleteUser(row)"
                type="danger"
                :icon="Delete"
                size="small"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                :icon="Setting"
                size="small"
                @click="distribution(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="parmas.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="parmas.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="fromTableData.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户或修改用户 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="65px"
      >
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addForm.username" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="!isEdit">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="closeAddUser">取消</el-button>
          <el-button type="primary" @click="addUser"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除按钮对话框 -->
    <el-dialog v-model="deleteFlag" title="警告" width="30%">
      <span>确定要删除{{ fromTableData.Username }}吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteFlag = false">取消</el-button>
          <el-button type="primary" @click="deleteClick"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色按钮对话框 -->
    <el-dialog v-model="distributionFlag" title="分配角色" width="50%">
      <div class="box">
        <div>当前用户是：{{ fromTableData.Username }}</div>
        <div>当前角色：{{ fromTableData.rolename }}</div>
        <div>
          分配新角色：<el-select
            v-model="fromTableData.value"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option
              v-for="item in RolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="distributionFlag = false">取消</el-button>
          <el-button type="primary" @click="distributionClick">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ArrowRight,
  Search,
  Edit,
  Delete,
  Setting,
} from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import {
  reqUserList,
  reqUpdateState,
  reqAddUsers,
  reqUpdateUsers,
  reqDeleteUser,
  reqRolesList,
  UpdateUserRole,
} from "../axios/Api";
// 请求参数
const parmas = reactive({
  query: "",
  pagenum: 1,
  pagesize: 2,
});
// 表格数据
const fromTableData = reactive({
  tableData: [],
  total: 1,
  userId: 1,
  Username: "",
  rolename: "",
  value: "",
  rid: 0,
});
// 添加修改表单数据
const addForm = reactive({
  username: "",
  password: "",
  email: "",
  mobile: "",
});

// 添加及修改遮罩层开关
let addDialogVisible = ref(false);

// 清空搜索框
function searchClear() {
  (parmas.query = ""), (parmas.pagenum = 1), (parmas.pagesize = 2);
  getUserList();
}

// 修改用户状态
async function switchClick({ id, mg_state }) {
  await reqUpdateState(id, mg_state);
}

// 页码改变
function handleCurrentChange(a) {
  parmas.pagenum = a;
  getUserList();
}

// 页面数量改变
function handleSizeChange(a) {
  parmas.pagesize = a;
  getUserList();
}

// 删除对话框开关
const deleteFlag = ref(false);
// 删除按钮点击事件
async function deleteUser({ id, username }) {
  deleteFlag.value = true;
  fromTableData.userId = id;
  fromTableData.Username = username;
}
// 删除对话框确定事件
async function deleteClick() {
  const res = await reqDeleteUser(fromTableData.userId);
  if (res.meta.status != 200) return;
  deleteFlag.value = false;
  getUserList();
}

// 分配角色对话框开关
const distributionFlag = ref(false);
// 获取角色列表
async function getRolesList() {
  const { data, meta } = await reqRolesList();
  if (meta.status != 200) return;
  RolesList.value = data;
}
const RolesList = ref([]);
getRolesList();
// 分配角色按钮点击事件
function distribution({ username, role_name, id }) {
  fromTableData.Username = username;
  fromTableData.rolename = role_name;
  fromTableData.userId = id;
  distributionFlag.value = true;
}
// 分配角色下拉菜单值改变事件
function selectChange(val) {
  fromTableData.rid = val;
}
// 分配角色对话框确定事件
async function distributionClick() {
  if (!fromTableData.rid) return ElMessage.error("请选择角色");
  const { meta } = await UpdateUserRole(
    fromTableData.userId,
    fromTableData.rid
  );
  if (meta.status != 200) return;
  distributionFlag.value = false;
  getUserList();
}

// 获取表单组件
const addFormRef = ref(null);

// 添加及修改用户确定事件
async function addUser() {
  let flags = false;
  if (isEdit.value) {
    const { email, mobile } = addForm;
    const { meta } = await reqUpdateUsers(fromTableData.userId, {
      email,
      mobile,
    });
    if (meta.status != 200) return flags = false;
    flags = true
  } else {
    const flag = await addFormRef.value
      .validate()
      .catch((err) => err);
    if(!flag) return flags = false
    const { meta } = await reqAddUsers(addForm);
    if (meta.status != 201) return flags = false;
    flags = true
  }
  if (!flags) return;
  addDialogVisible.value = false;
  addFormRef.value.resetFields();
  addForm.username = "",
  addForm.password = ""
  addForm.email = "",
  addForm.mobile = "";
  getUserList();
}

// 添加及修改取消事件
function closeAddUser() {
  addDialogVisible.value = false;
  addFormRef.value.resetFields();
  addForm.username = "",
  addForm.password = ""
    addForm.email = "",
    addForm.mobile = "";
}

// 添加及修改点击事件
function addUsers(row) {
  fromTableData.userId = row.id;
  addDialogVisible.value = true;
  if (!row.username) return (isEdit.value = false);
  (addForm.username = row.username),
    (addForm.email = row.email),
    (addForm.mobile = row.mobile);
  isEdit.value = true;
}

// 遮罩层是否是编辑
const isEdit = ref(true);

// 添加修改表单验证规则
const addFormRules = {
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
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        const rsg =
          /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!rsg.test(value)) return callback("邮箱不合法");
        callback();
      },
      trigger: "blur",
    },
  ],
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        const rsg =
          /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
        if (!rsg.test(value)) return callback("手机号不合法");
        callback();
      },
      trigger: "blur",
    },
  ],
};

// 调用接口请求数据
async function getUserList() {
  const { data, meta } = await reqUserList(parmas);
  if (meta.status !== 200) return;
  fromTableData.tableData = data.users;
  fromTableData.total = data.total;
}
getUserList();
</script>

<style lang="less" scoped>
.box > div {
  margin: 10px 0;
  font-size: 18px;
}
</style>