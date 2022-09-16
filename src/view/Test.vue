<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="cat_id"
      border
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="cat" label="cat" width="180" />
      <el-table-column prop="date" label="date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
const tableData = [
  {
    cat_id: 1,
    date: "2016-05-02",
    name: "wangxiaohu",
    cat: "第一项",
    children: [
      {
        cat_id: 11,
        date: "2016-05-01",
        name: "wangxiaohu",
      },
      {
        cat_id: 12,
        date: "2016-05-01",
        name: "wangxiaohu",
        children: [
          {
            cat_id: 121,
            date: "2016-05-01",
            name: "wangxiaohu",
          },
          {
            cat_id: 122,
            date: "2016-05-01",
            name: "wangxiaohu",
          },
        ],
      },
    ],
  },
  {
    cat_id: 2,
    date: "2016-05-04",
    name: "wangxiaohu",
    cat: "第二项",
    children: [
      {
        cat_id: 21,
        date: "2016-05-01",
        name: "wangxiaohu",
      },
      {
        cat_id: 22,
        date: "2016-05-01",
        name: "wangxiaohu",
      },
    ],
  },
  {
    cat_id: 3,
    date: "2016-05-01",
    name: "wangxiaohu",
    cat: "第三项",
    children: [
      {
        cat_id: 31,
        date: "2016-05-01",
        name: "wangxiaohu",
      },
      {
        cat_id: 32,
        date: "2016-05-01",
        name: "wangxiaohu",
      },
    ],
  },
  {
    cat_id: 4,
    cat: "第四项",
    date: "2016-05-03",
    name: "wangxiaohu",
  },
];
</script>
