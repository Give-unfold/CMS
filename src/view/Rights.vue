<template>
  <div class="rights">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column type="index" />
        <el-table-column prop="authName" label="权限的名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column label="权限等级">
          <template #default="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag v-else-if="row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reqRightsList } from "../axios/Api";
import { ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
async function getRightsList() {
  const { data, meta } = await reqRightsList("list");
  if (meta.status != 200) return;
  tableData.value = data;
}
getRightsList();
const tableData = ref([]);
</script>

<style>
</style>