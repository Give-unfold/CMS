<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
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
              <el-button :icon="Search" @click="sea" />
            </template>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        border
        :data="fromTableData.tableData"
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column type="index" label="#" />
        <el-table-column prop="order_number" label="订单编号" width="400" />
        <el-table-column prop="order_price" label="订单价格" />
        <el-table-column prop="is_send" label="是否付款" />
        <el-table-column prop="create_time" label="下单时间" />
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
                @click="addModity(row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="deleteModity(row)"
                type="danger"
                :icon="Setting"
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
import { ArrowRight, Search, Edit, Setting } from "@element-plus/icons-vue";
import { reqOrdersList } from "../axios/Api";
import { reactive } from "vue";
// 订单列表请求参数
const parmas = reactive({
  query: "",
  pagenum: 1,
  pagesize: 10,
});

function sea() {
  console.log(parmas.query);
  getOrdersList();
}

// 编辑事件
function addModity() {}

// 设置事件
function deleteModity() {}

// 页面数据
const fromTableData = reactive({
  tableData: [],
  total: 1,
  goods_name: "",
  id: 0,
});

// 搜索清空事件
function searchClear() {
  (parmas.query = ""), (parmas.pagenum = 1), (parmas.pagesize = 10);
  getOrdersList();
}

// 页码改变
function handleCurrentChange(a) {
  parmas.pagenum = a;
  getOrdersList();
}

// 页面数量改变
function handleSizeChange(a) {
  parmas.pagesize = a;
  getOrdersList();
}

// 获取订单数据列表
async function getOrdersList() {
  const { data, meta } = await reqOrdersList(parmas);
  if (meta.status != 200) return;
  fromTableData.tableData = data.goods;
  fromTableData.total = data.total;
  fromTableData.tableData.forEach((item) => {
    const date = new Date(item.create_time);
    const MM = +(date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1);
    const YY = date.getFullYear();
    const DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();
    item.create_time =
      YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
  });
}
getOrdersList();
</script>

<style>
</style>