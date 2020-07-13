let _Vue = null
export default class VueRouter {
    static install(Vue) {
        if (VueRouter.install.installed) return
        VueRouter.install.installed = true
        _Vue = Vue
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$route = this.$options.router
                }

            }
        })
    }
    constructor(options) {
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: "/"
        })
    }
}