import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={   //要设置的全局访问的state对象
    isAdmin: false,
    isLogin:false,
    token:null,
    filename:null,
    searchContent:'',
    //要设置的初始属性值
};
const getters = {   //实时监听state值的变化(最新状态)
    getAdminStatus(state) {  //方法名随意,主要是来承载变化的isAdmin的值
        return state.isAdmin;
    },
    getLoginStatus(state) {  //方法名随意,主要是来承载变化的isAdmin的值
        return state.isLogin
    },
    getToken(state){  //方法名随意,主要是用来承载变化的token的值
       return state.token
    },
    getFileName(state){
        return state.filename
    },
    getSearchContent(state){
        return state.searchContent;
    }
};
const mutations = {
    login(state,token){
        sessionStorage.setItem("isLogin",true);
        sessionStorage.setItem("token",token);
        state.isLogin = true;
        state.token = token;
    },
    logOut(state){
        state.isLogin = false;
        state.token = null;
        sessionStorage.removeItem("isLogin");
        sessionStorage.removeItem("token");
        if(state.isAdmin){
            state.isAdmin = false;
            sessionStorage.removeItem("isAdmin");
        }
    },
    setAdminStatus(state,status) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        sessionStorage.setItem("isAdmin",status);         
        state.isAdmin = status;
    },
    setFileName(state,name){
        state.filename = name;
    },
    setSearchContent(state,content){
        state.searchContent = content;
    }
};
const actions = {
    changeAdminStatus(context,status) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        context.commit('setAdminStatus',status);
    },
    login(context,token) {  //同上注释
        context.commit('login',token);
    },
    logOut(context) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        context.commit('logOut');
    },
    changeFileName(context,name){
        context.commit('setFileName',name);
    },
    changeSearchContent(context,content){
        context.commit('setSearchContent',content);
    }
};
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
export default store;