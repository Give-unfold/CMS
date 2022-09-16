<template>
  <div class="params">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      />
      <el-row>
        <span>选择商品分类：</span>
        <el-cascader
          v-model="active.AttrList"
          :options="active.options"
          :props="props"
          @change="handleChange"
        />
      </el-row>

      <el-tabs
        v-model="active.activeName"
        class="demo-tabs"
        @tab-change="handleClick"
      >
        <el-tab-pane label="动态参数" name="many">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button
                :disabled="ActiveFlag"
                type="primary"
                size="large"
                @click="addCategor({})"
              >
                添加参数
              </el-button>
            </el-col>
          </el-row>
          <el-table
            :data="active.tableData"
            border
            style="width: 100%; margin: 10px 0"
            row-key="attr_id"
          >
            <el-table-column type="expand">
              <template #default="{ row }">
                <el-tag
                  v-for="(item, index) in row.attr_vals"
                  :key="row.attr_id + index"
                  closable
                  @close="tagDelete(index, row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="inputVisible"
                  ref="InputRef"
                  v-model="active.inputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="参数名称" />
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
                    @click="addCategor(row)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    @click="CategorDelete(row)"
                    type="danger"
                    :icon="Delete"
                    size="small"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button
                :disabled="ActiveFlag"
                type="primary"
                size="large"
                @click="addCategor({})"
              >
                添加属性
              </el-button>
            </el-col>
          </el-row>
          <el-table
            :data="active.tableData"
            border
            style="width: 100%; margin: 10px 0"
            row-key="attr_id"
          >
            <el-table-column type="expand">
              <template #default="{ row }">
                <el-tag
                  v-for="(item, index) in row.attr_vals"
                  :key="row.attr_id + index"
                  closable
                  @close="tagDelete(index, row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="inputVisible"
                  ref="InputRef"
                  v-model="active.inputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" />
            <el-table-column prop="attr_name" label="参数名称" />
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
                    @click="addCategor(row)"
                  ></el-button>
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    @click="CategorDelete(row)"
                    type="danger"
                    :icon="Delete"
                    size="small"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加编辑动态参数对话框 -->
    <el-dialog
      v-model="updataFlag"
      :title="active.addMany ? '添加参数' : '编辑参数'"
      width="50%"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item prop="roleName" label="参数名称">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updataFlagClose">取消</el-button>
          <el-button type="primary" @click="updataClick"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowRight, Edit, Delete } from "@element-plus/icons-vue";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import {
  reqCategories,
  reqCategoriesAttrList,
  reqDeleteCategor,
  reqAddCategor,
  reqUpdataCategor,
} from "../axios/Api";

// 添加tag
const inputVisible = ref(false);

function showInput() {
  inputVisible.value = true;
}

async function handleInputConfirm(row) {
  if (active.inputValue) {
    row.attr_vals.push(active.inputValue);
  }
  let id = +row.cat_id;
  const res = await reqUpdataCategor(active.AttrList.join(" "), id, {
    attr_name: row.attr_name,
    attr_sel: row.attr_sel,
    attr_vals: row.attr_vals.join(" "),
  });
  console.log(res);
  console.log(row.cat_id, id, row.attr_sel, row.attr_vals);
  inputVisible.value = false;
  active.inputValue = "";
}

// 添加编辑分类参数对话框
const updataFlag = ref(false);

const addFormRef = ref(null);

// 添加编辑分类参数确定事件
async function updataClick() {
  console.log(active.AttrList.join(","), addForm.attr_sel);
  const res = await reqAddCategor(active.AttrList.join(","), {
    attr_name: addForm.attr_name,
    attr_sel: addForm.attr_sel,
  });
  console.log(res);
  updataFlag.value = false;
  addForm.attr_name = "";
  getCategoriesAttrList();
}

function updataFlagClose() {
  updataFlag.value = false;
  addFormRef.value.resetFields();
  addForm.attr_name = "";
}

const addForm = reactive({
  attr_name: "",
  attr_sel: "",
});

const active = reactive({
  options: [],
  AttrList: [],
  activeName: "many",
  tableData: [],
  inputName: "",
  addMany: false,
  inputValue: "",
});

// 校验规则
const addFormRules = {
  roleName: [
    {
      required: true,
      message: "请输入参数名称",
      trigger: "blur",
    },
  ],
};

// // 级联列表别名
const props = {
  value: "cat_id",
  label: "cat_name",
};

const ActiveFlag = computed(() => {
  return active.AttrList.length != 3;
});

// 禁用添加参数点击事件
function addCategor(row) {
  if (active.activeName == "many") {
    if (row.attr_id || row.attr_name) {
      console.log(row.attr_sel);
      updataFlag.value = true;
      active.addMany = false;
      addForm.attr_name = row.attr_name;
      addForm.attr_sel = "many";
    } else {
      updataFlag.value = true;
      active.addMany = true;
      addForm.attr_sel = "many";
    }
  } else if (active.activeName == "only") {
    if (row.attr_id || row.attr_name) {
      console.log("编辑属性");
    } else {
      console.log("添加属性");
    }
  }
  console.log(row);
}

// 删除动态参数
async function CategorDelete(row) {
  const flag = await ElMessageBox.confirm("确定要删除该参数吗", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).catch((err) => err);
  if (flag != "confirm") return;
  const { meta } = await reqDeleteCategor(
    active.AttrList.join(","),
    row.attr_id
  );
  if (meta.status != 200) return;
  getCategoriesAttrList();
}

async function getCategoriesAttrList() {
  const { data, meta } = await reqCategoriesAttrList(
    active.AttrList[2],
    active.activeName
  );
  if (meta.status != 200) return;
  data.forEach((item) => {
    item.attr_vals = item.attr_vals.length < 1 ? [] : item.attr_vals.split(" ");
  });
  active.tableData = data;
  console.log(active.tableData);
  // console.log(active.AttrList);
}

function handleChange() {
  if (active.AttrList.length != 3) return (active.AttrList = []);
  getCategoriesAttrList();
  console.log(active.AttrList);
}

function handleClick() {
  getCategoriesAttrList();
}

// 获取商品分类参数列表
async function getCategories() {
  const { data, meta } = await reqCategories();
  // console.log(data);
  if (meta.status != 200) return;
  active.options = data;
}
getCategories();
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px 0;
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 0 10px 10px !important;
}
.el-input {
  width: 25% !important;
}
</style>