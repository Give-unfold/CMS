<template>
  <div>
    <h2>页面找不到啦······404~~</h2>
    <button @click="btnClick">回到首页</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "NotFound",
  setup() {
    const router = useRouter();
    function btnClick() {
      router.replace("/welcome");
    }
    return {
      btnClick,
    };
  },
};
</script>

<style>
</style>