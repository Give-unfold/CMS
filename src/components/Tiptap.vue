<template>
  <div class="tiptap">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />

    <Editor
      style="height: 350px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef, provide, defineEmits } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("<p>hello</p>");

const $emit = defineEmits(["valueChange"]);

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editor.on("change", () => {
    $emit("valueChange", valueHtml.value);
    console.log(valueHtml.value);
  });
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style lang="less" scoped>
.tiptap {
  border: 1px solid #ddd;
  overflow: hidden;
}
</style>