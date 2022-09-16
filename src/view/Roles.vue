<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" size="large" @click="addRole({})">
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <el-table
        class="box"
        :data="rolesList"
        border
        style="width: 100%; margin: 10px 0"
        row-key="id"
        :expand-row-keys="expandRowKeys"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-row
              v-for="(item, index) in row.children"
              :key="item.id"
              class="bb"
              :class="{ bt: index === 0 }"
            >
              <el-col :span="6">
                <el-tag closable @close="closeTag(row.id, item.id, 1)"
                  >{{ item.authName }}
                </el-tag>
                <el-icon><CaretRight /></el-icon>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(citem, cindex) in item.children"
                  :key="citem.id"
                  :class="{ bt: cindex !== 0 }"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(row.id, citem.id, 2)"
                    >
                      {{ citem.authName }}
                    </el-tag>
                    <el-icon><CaretRight /></el-icon>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="ccitem in citem.children"
                      :key="ccitem.id"
                      closable
                      @close="closeTag(row.id, ccitem.id, 3)"
                      >{{ ccitem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              :icon="Edit"
              size="small"
              @click="addRole(row)"
              >编辑</el-button
            >
            <el-button
              @click="deleteRole(row)"
              type="danger"
              :icon="Delete"
              size="small"
              >删除</el-button
            >
            <el-button
              type="warning"
              :icon="Setting"
              size="small"
              @click="distribution(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加及编辑角色 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isEdit ? '编辑角色' : '添加角色'"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="closeAddRole">取消</el-button>
          <el-button type="primary" @click="addRoleClick"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      v-model="addRoleDialogVisible"
      title="分配权限"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-tree
        :data="treeData"
        :props="defaultProps"
        ref="treeRef"
        show-checkbox
        default-expand-all
        node-key="id"
      />
      <template #footer>
        <span>
          <el-button @click="addRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="RoleClick"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowRight, Edit, Delete, Setting } from "@element-plus/icons-vue";
import {
  reqRolesList,
  reqDeleteRoles,
  reqAddRoles,
  reqUpdateRoles,
  reqDeleteRole,
  reqRightsList,
  reqUpdataRoleRights,
} from "../axios/Api";
import { reactive, ref, nextTick } from "vue";
const rolesList = ref([]);

// 默认展开行
const expandRowKeys = ref([]);
// 删除指定权限
async function closeTag(roleId, rightId) {
  const flag = await ElMessageBox.confirm("确定要删除该权限吗", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).catch((err) => err);
  if (flag != "confirm") return;
  const { meta } = await reqDeleteRoles(roleId, rightId);
  if (meta.status != 200) return;
  expandRowKeys.value = [roleId];
  getRolesList();
}

// 删除用户
async function deleteRole({ id }) {
  const flag = await ElMessageBox.confirm("确定要删除该角色吗", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).catch((err) => err);
  if (flag != "confirm") return;
  await reqDeleteRole(id);
  getRolesList();
}

// 分配权限遮罩层开关
const addRoleDialogVisible = ref(false);

// 分配权限树形控件数据
const treeData = ref([]);

// 分配权限树形组件实例
const treeRef = ref(null);

// 分配权限选中状态的数组id
function getTreeChecked(obj, arr) {
  if (!obj.children) return arr.push(obj.id);
  obj.children.forEach((item) => getTreeChecked(item, arr));
}

// 分配权限树形组件数据别名
const defaultProps = {
  children: "children",
  label: "authName",
};

// 分配权限点击事件
async function distribution(row) {
  addRoleDialogVisible.value = true;
  console.log(row.id);
  roleData.id = row.id;
  const { data } = await reqRightsList("tree");
  treeData.value = data;
  let keys = ref([]);
  getTreeChecked(row, keys.value);
  nextTick(() => {
    treeRef.value.setCheckedKeys(keys.value, true);
  });
}

// 分配权限确定事件
async function RoleClick() {
  const sum = [
    ...treeRef.value.getHalfCheckedKeys(),
    ...treeRef.value.getCheckedKeys(),
  ];
  const { meta } = await reqUpdataRoleRights(roleData.id, sum.join(","));
  if (meta.status != 200) return;
  addRoleDialogVisible.value = false;
  getRolesList();
}

// 公用属性
const roleData = reactive({
  id: 0,
});

// 添加及修改角色信息
const addForm = reactive({
  roleName: "",
  roleDesc: "",
});

// 添加及编辑角色遮罩层开关
const addDialogVisible = ref(false);

// 遮罩层是否是编辑
const isEdit = ref(true);

// 获取表单组件
const addFormRef = ref(null);

// 添加及编辑角色
function addRole(row) {
  addDialogVisible.value = true;
  if (!row.roleName) return (isEdit.value = false);
  addForm.roleName = row.roleName;
  addForm.roleDesc = row.roleDesc;
  roleData.id = row.id;
  isEdit.value = true;
}

// 添加及修改角色确定事件
async function addRoleClick() {
  let flags = false;
  if (isEdit.value) {
    const res = await reqUpdateRoles(roleData.id, addForm);
    console.log(res);
    if (res.meta.status != 200) flags = true;
  } else {
    const res = await reqAddRoles(addForm);
    console.log(res);
    if (res.meta.status != 201) flags = true;
  }
  if (flags) return;
  addDialogVisible.value = false;
  addFormRef.value.resetFields();
  addForm.roleName = "";
  addForm.roleDesc = "";
  getRolesList();
}

// 添加及修改角色取消事件
function closeAddRole() {
  addDialogVisible.value = false;
  addFormRef.value.resetFields();
  addForm.roleName = "";
  addForm.roleDesc = "";
}

// 添加及修改角色校验规则
const addFormRules = {
  roleName: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: "blur",
    },
  ],
  roleDesc: [
    {
      required: true,
      message: "请输入角色描述",
      trigger: "blur",
    },
  ],
};

// 获取角色列表
async function getRolesList() {
  const { data, meta } = await reqRolesList();
  if (meta.status != 200) return;
  rolesList.value = data;
}
getRolesList();
</script>

<style>
.bt {
  border-top: 1px solid #dddddd;
}
.bb {
  border-bottom: 1px solid #dddddd;
}
.el-table__expanded-cell {
  padding: 20px 50px !important;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px;
}
</style>