<template>
  <div class="reports">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <main ref="box"></main>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ArrowRight } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { reqReports } from "../axios/Api";

// 容器实例
const box = ref(null);

// 获取数据并渲染
async function getReports() {
  const { data, meta } = await reqReports();
  if (meta.status != 200) return;
  let resOption = data;
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(box.value);
  // 合并获取数据及echart配置项
  const option = Object.assign(optionEchart, resOption);
  // 绘制图表
  myChart.setOption(option);
}

// echart配置项
let optionEchart = {
  title: {
    text: "用户来源",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      AreaStyl: {},
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "Union Ads",
      type: "line",
      stack: "Total",
      AreaStyl: {},
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "Video Ads",
      type: "line",
      stack: "Total",
      AreaStyl: {},
      emphasis: {
        focus: "series",
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "Direct",
      type: "line",
      stack: "Total",
      AreaStyl: {},
      emphasis: {
        focus: "series",
      },
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "Search Engine",
      type: "line",
      stack: "Total",
      label: {
        show: true,
        position: "top",
      },
      AreaStyl: {},
      emphasis: {
        focus: "series",
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};

onMounted(() => {
  getReports();
});
</script>

<style lang="less" scoped>
main {
  width: 500px;
  height: 400px;
}
</style>