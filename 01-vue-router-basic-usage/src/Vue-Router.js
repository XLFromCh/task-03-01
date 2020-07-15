let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    //2 把Vue的构造函数记录在全局
    _Vue = Vue;
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      }
    });
  }
  constructor(options) {
    this.options = options;
    this.routeMap = {};

    window.addEventListener(
      "load",
      () => {
        this.init();
      },
      false
    );
    window.addEventListener(
      "hashchange",
      () => {
        this.init();
      },
      false
    );
  }
  init() {
    this.createRouteMap();
    this.initComponent(_Vue);
  }
  createRouteMap() {
    //遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }
  initComponent(Vue) {
    console.dir(Vue);
    let hashUrl = location.hash.slice(1) || "/";
    Vue.component("router-link", {
      props: {
        to: String
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickhander
            }
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickhander(e) {
          // history.pushState({},"",this.to)
          location.hash = this.to;
          e.preventDefault();
        }
      }
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        const cm = self.routeMap[hashUrl];
        return h(cm);
      }
    });
  }
}
