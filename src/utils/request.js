import config from "@/config/index";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;

const isHttpSuccess = (status) => {
  return status >= 200 && status < 300;
};

export const errorHandle = (res) => {
  // 日志处理 -> 全局错误提示
  // ?  这里要处理下日志信息
  wx.showToast({
    title: "请求异常",
    icon: "none",
    duration: 2000,
  });
};

// 设置pending来防止重复发送请求
const pending = {};
export const request = async (options = {}) => {
  // 考虑与微信的接口进行兼容
  const { success, fail } = options;
  const key = options.url + "&" + (options.method || "GET");
  // 调整执行位置
  //   防止一直重复的发送请求
  if (pending[key]) {
    pending[key].abort();
  }

  const header = {};
  options.url = baseUrl + options.url;
  const result = new Promise((resolve, rject) => {
    wx.showLoading();
    pending[key] = wx.request(
      //   传递请求的参数对象
      Object.assign({}, options, {
        header,
        success: (res) => {
          // 避免重复请求
          delete pending[key];
          // 请求成功http Status状态码判断
          // '200' -> startWith('2')
          if (isHttpSuccess(res.statusCode)) {
            //   如果传了success的fn
            if (success) {
              success(res.data);
              return;
            }
            resolve(res.data);
          } else {
            errorHandle(res);
            reject(res);
          }
        },
        fail: (err) => {
          delete pending[key];
          errorHandle(err);
          //   如果传了fail的fn
          if (fail) {
            fail(err);
            return;
          }
          reject(err);
        },
        complete: () => {
          wx.hideLoading();
        },
      })
    );
  });

  return result;
};

// 自己封装axios
export const axios = {
  get(url, data, options) {
    return request({
      url,
      data,
      method: "GET",
      ...options,
    });
  },
  post(url, data, options) {
    return request({
      url,
      data,
      method: "POST",
      ...options,
    });
  },
};
