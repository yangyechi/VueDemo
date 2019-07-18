import axios from 'axios'
import QS from 'qs';
import store from '../store/index'

// 超时时间
axios.defaults.timeout = 10000;
// 默认地址
//axios.defaults.baseURL = 'http://127.0.0.1:8767/';
//post请求头的设置
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 路由请求拦截
// http request 拦截器
axios.interceptors.request.use(
    config => {
      //若token存在，则每个http header都加上token
      const token = store.state.token;
      token && (config.headers.Authorization = token);   
      return config;
    },
    error => {
      this.$message.error("请求发生错误!");
      return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // 对响应数据做些事
    if (response.status === 200) {
        if(response.headers.filename){
            store.state.filename = decodeURI(response.headers.filename)
        }
        return Promise.resolve(response);       
    }
    return Promise.reject(response); 
}, error => {
    this.$message.error("请求失败:" + error.response.status);
    router.replace({   
        path: '/',   
        query: { 
         redirect: router.currentRoute.fullPath 
        }
    });
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
})

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params){ 
    return new Promise((resolve, reject) =>{  
        axios.get(url, {   
            params: params  
        })  
        .then(res => {   
            resolve(res.data);  
        })  
        .catch(err => {   
            reject(err.data)  
        }) 
    });
}

/** 
 * post方法，对应文件下载请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} id [请求时携带的文件id] 
*/
export function downloadFile(url, id) { 
    //{headers:{'Content-Type':'application/json;application/octet-stream'}}
    return new Promise((resolve, reject) => {   
        axios.post(
            url,
            id,
            {responseType:'blob' },
            )  
        .then(res => {   
            resolve(res.data);  
        })  
        .catch(err => {   
            reject(err.data)  
        }) 
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
*/
export function post(url, params) { 
    return new Promise((resolve, reject) => {   
        //QS.stringify
        axios.post(url,JSON.stringify(params))  
        .then(res => {   
            resolve(res.data);  
        })  
        .catch(err => {   
            reject(err.data)  
        }) 
    });
}

/** 
 * post方法，对应文件上传请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} fromData [请求时携带的文件及其他参数] 
*/
export function uploadFile(url, fromData) { 
    return new Promise((resolve, reject) => {   
        //QS.stringify
        axios.post(
            url,
            fromData,
            {headers:{'Content-Type': 'multipart/form-data'}}
            )  
        .then(res => {   
            resolve(res.data);  
        })  
        .catch(err => {   
            reject(err.data)  
        }) 
    });
}
export default axios;