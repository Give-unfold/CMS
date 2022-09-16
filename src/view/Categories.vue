<template>
  <div class="categories">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" size="large" @click="addCategor({})">
            添加分类
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="fromTableData.tableData"
        style="width: 100%; margin: 20px 0"
        row-key="cat_id"
        border
      >
        <el-table-column prop="index" label="序号" width="80" />
        <el-table-column prop="cat_name" label="分类名称" />
        <el-table-column label="是否有效" width="180">
          <template #default="{ row }">
            <el-icon v-if="row.cat_deleted == 0" style="color: green"
              ><CircleCheck
            /></el-icon>
            <el-icon v-else><CircleClose /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="180">
          <template #default="{ row }">
            <el-tag v-if="row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="row.cat_level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
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
                @click="deleteUser(row)"
                type="danger"
                :icon="Delete"
                size="small"
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="parmas.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="fromTableData.total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import {
  ArrowRight,
  Edit,
  Delete,
  CircleCheck,
  CircleClose,
} from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { reqCategories } from "../axios/Api";

const parmas = reactive({
  type: [],
  pagenum: 1,
  pagesize: 5,
});

// 页面数据
const fromTableData = reactive({
  tableData: [],
  total: 1,
  goods_name: "",
  id: 0,
});

function addCategor(row) {}

// 页码改变
function handleCurrentChange(a) {
  parmas.pagenum = a;
  getCategories();
}

// 页面数量改变
function handleSizeChange(a) {
  parmas.pagesize = a;
  getCategories();
}

async function getCategories() {
  console.log(parmas);
  const { data, meta } = await reqCategories(parmas);
  if (meta.status != 200) return;
  fromTableData.tableData = data.result;
  fromTableData.tableData.forEach((item, index) => {
    item.index = ++index;
  });
  fromTableData.total = data.total;
  console.log(data, fromTableData.tableData, meta);
}
getCategories();
</script>

<style>
</style>