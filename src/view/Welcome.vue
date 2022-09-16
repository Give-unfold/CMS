<template>
  <h2>欢迎{{ username }}</h2>
</template>

<script>
export default {
  name: "Welcome",
  setup() {
    const username = JSON.parse(sessionStorage.getItem("userInfo")).username;
    return {
      username,
    };
  },
};
</script>

<style>
</style>