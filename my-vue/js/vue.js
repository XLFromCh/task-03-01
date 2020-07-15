class Vue {
    constructor(options) {
        //1.通过书信保存选项的数据
        //2.把data中的成员转换成getter和setter，注入到vue实例中
        //3、调用observer监听数据变化
        //4、调用compiler,解析指令和差值表达式
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        this.$methods = options.methods || {}

        this._proxyData(this.$data)

        this._proxyData(this.$methods)

        new Observer(this.$data)

        new Compiler(this)
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if (newValue === data[key]) return
                    data[key] = newValue
                }
            })
        })
    }
}