<template>
  <div class="goodsAdd">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        show-icon
        :title="isEdit ? '编辑商品信息' : '添加商品信息'"
        type="info"
        center
        :closable="false"
      />
      <!-- 步骤条 -->
      <el-steps :active="active.stepActive" align-center size="small">
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>
      <!-- 侧边tabs -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          :before-leave="tabsLeave"
          @tab-change="tabsChange"
          tab-position="left"
          class="tabsBox"
          v-model="active.stepActive"
        >
          <el-tab-pane label="商品信息" :name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item prop="" label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="active.options"
                :props="props"
                @change="handleChange"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" :name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in active.AttrManyList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="citem"
                  v-for="(citem, index) in item.attr_vals"
                  :key="item.attr_id + index"
                />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" :name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in active.AttrOnlyList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" :name="3">
            <el-upload
              :file-list="fileList"
              :action="RES_URL + 'upload'"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="onSuccess"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" :name="4">
            <tiptap ref="tiptap" @valueChange="valueChange" />
            <el-button style="margin: 10px 0" type="primary" @click="fromClick">
              添加商品
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" v-model="dialogVisible">
      <img w-full :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { reactive, ref, inject, computed, onUnmounted } from "vue";
import {
  reqCategories,
  reqCategoriesAttrList,
  reqAddGoods,
} from "../axios/Api";
import { useRouter } from "vue-router";
import { RES_URL } from "../axios/Url";
import Tiptap from "../components/Tiptap.vue";
const active = reactive({
  stepActive: 0,
  options: [],
  AttrOnlyList: [],
  AttrManyList: [],
});

// 级联列表别名
const props = {
  value: "cat_id",
  label: "cat_name",
};

const tiptap = ref(null);

const isEdit = computed(() => {
  return JSON.parse(sessionStorage.getItem("goodsInfo"));
});
console.log(isEdit);

const addForm = reactive({
  goods_name: isEdit.value?.goods_name ?? "",
  goods_price: isEdit.value?.goods_price ?? 0,
  goods_weight: isEdit.value?.goods_weight ?? 0,
  goods_number: isEdit.value?.goods_number ?? 0,
  goods_introduce: "",
  goods_cat: [],
  pics: [],
  attrs: [],
});

const router = useRouter();

async function fromClick() {
  addForm.attrs = [];
  active.AttrOnlyList.forEach((item) => addForm.attrs.push(item));
  active.AttrManyList.forEach((item) => addForm.attrs.push(item));
  addForm.goods_cat = addForm.goods_cat.join(",");
  addForm.goods_weight = +addForm.goods_weight;
  addForm.goods_price = +addForm.goods_price;
  addForm.goods_number = +addForm.goods_number;
  const { meta } = await reqAddGoods(addForm);
  if (meta.status != 201) return;
  router.replace("/goods");
}

function valueChange(a) {
  addForm.goods_introduce = a;
}

const fileList = ref([]);

// 图片请求头对象
const headersObj = {
  Authorization: sessionStorage.getItem("token"),
};

// 图片上传成功的事件
function onSuccess({ data }) {
  addForm.pics.push({
    pic: data.tmp_path,
  });
  console.log(data);
  // fileList.value = addForm.pics.map(item => ({url:item.pic,name:item.pic}))
  // console.log(fileList.value)
}

const previewPath = ref("");
const dialogVisible = ref(false);
// 图片预览事件
function handlePreview({
  response: {
    data: { url },
  },
}) {
  console.log(url);
  previewPath.value = url;
  dialogVisible.value = true;
}

// 图片移除事件
function handleRemove({
  response: {
    data: { tmp_path },
  },
}) {
  // const index = addForm.pics.findIndex(item => item.pic == tmp_path)
  // addForm.pics.splice(index,1)
  addForm.pics = addForm.pics.filter((item) => item.pic != tmp_path);
}

// tab栏切换
let elmsg = null;
function tabsLeave(newValue, old) {
  if (old == 0 && addForm.goods_cat.length != 3) {
    if (elmsg) elmsg.close();
    elmsg = ElMessage({
      message: "请选择商品分类",
      type: "warning",
    });
    return active.stepActive == 0 && addForm.goods_cat.length == 3;
  }
  return true;
}
async function tabsChange(value) {
  if (value == 1) {
    const { meta, data } = await reqCategoriesAttrList(
      addForm.goods_cat[2],
      "many"
    );
    if (meta.status !== 200) return;
    data.forEach((item) => {
      item.attr_vals =
        item.attr_vals.length == 0 ? [] : item.attr_vals.split(" ");
    });
    active.AttrManyList = data;
    console.log(data);
  }
  if (value == 2) {
    const { meta, data } = await reqCategoriesAttrList(
      addForm.goods_cat[2],
      "only"
    );
    if (meta.status !== 200) return;
    data.forEach((item) => {
      item.attr_vals = [item.attr_vals];
    });
    active.AttrOnlyList = data;
    console.log(data);
  }
  console.log(value);
}

// 组件销毁时清掉本地存储
onUnmounted(() => {
  sessionStorage.removeItem("goodsInfo");
});

// 级联选择器默认只能选中三级属性
function handleChange() {
  if (addForm.goods_cat.length != 3) return (addForm.goods_cat = []);
  console.log(addForm.goods_cat);
}

// 获取商品分类参数列表
async function getCategories() {
  const { data, meta } = await reqCategories();
  if (meta.status != 200) return;
  active.options = data;
}
getCategories();

const addFormRules = {
  goods_name: [
    {
      required: true,
      message: "请输入商品名称",
      trigger: "blur",
    },
  ],
  goods_price: [
    {
      required: true,
      message: "请输入商品价格",
      trigger: "blur",
    },
  ],
  goods_weight: [
    {
      required: true,
      message: "请输入商品重量",
      trigger: "blur",
    },
  ],
  goods_number: [
    {
      required: true,
      message: "请输入商品数量",
      trigger: "blur",
    },
  ],
};
</script>

<style lang="less" scoped>
.tabsBox {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}
</style>