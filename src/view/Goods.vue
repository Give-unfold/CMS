<template>
  <div class="goods">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
              <el-button :icon="Search" @click="getGoodsList()" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="large" @click="addModity({})"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        border
        :data="fromTableData.tableData"
        style="width: 100%; margin: 10px 0"
      >
        <el-table-column type="index" label="#" />
        <el-table-column prop="goods_name" label="商品名称" width="400" />
        <el-table-column prop="goods_price" label="商品价格" />
        <el-table-column prop="goods_weight" label="商品重量" />
        <el-table-column prop="add_time" label="创建时间" />
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
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="deleteModity(row)"
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

    <!-- 删除按钮对话框 -->
    <el-dialog v-model="deleteFlag" title="警告" width="30%">
      <span>确定要删除{{ fromTableData.goods_name }}吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteFlag = false">取消</el-button>
          <el-button type="primary" @click="deleteClick"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowRight, Search, Edit, Delete } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { reqGoodsList, deleteGoods } from "../axios/Api";

// 商品列表请求参数
const parmas = reactive({
  query: "",
  pagenum: 1,
  pagesize: 10,
});

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
  getGoodsList();
}

// 创建路由实例
const router = useRouter();

// 添加及编辑商品点击事件
function addModity(row) {
  if (row.goods_id || row.goods_name)
    sessionStorage.setItem("goodsInfo", JSON.stringify(row));
  router.push("/goods/goodsAdd");
}

// 删除商品对话框遮罩层
const deleteFlag = ref(false);

// 删除商品点击事件
function deleteModity(row) {
  fromTableData.goods_name = row.goods_name;
  fromTableData.id = row.goods_id;
  deleteFlag.value = true;
}

// 删除商品确定事件
async function deleteClick() {
  const { meta } = await deleteGoods(fromTableData.id);
  if (meta.status !== 200) return;
  deleteFlag.value = false;
  getGoodsList();
}

// 页码改变
function handleCurrentChange(a) {
  parmas.pagenum = a;
  getGoodsList();
}

// 页面数量改变
function handleSizeChange(a) {
  parmas.pagesize = a;
  getGoodsList();
}

// 获取商品列表数据
async function getGoodsList() {
  const { data, meta } = await reqGoodsList(parmas);
  if (meta.status != 200) return;
  console.log(data);
  fromTableData.tableData = data.goods;
  fromTableData.total = data.total;
}
getGoodsList();
</script>

<style>
</style>