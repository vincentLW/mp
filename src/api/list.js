import axios from "@/utils/request";
import qs from "qs";

// 查询条件主题
export const getList = (data) =>
  axios.get("/public/hotPost?" + qs.stringify(data));
