import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";
import PrimeVue from "primevue/config";

createApp(App)
  .use(PrimeVue, {
    theme: "none",
  })
  .mount("#app");
