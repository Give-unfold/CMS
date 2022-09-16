import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/test.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App).use(router).use(ElementPlus, {
  locale: zhCn,
});

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
