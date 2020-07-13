class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if (!data || typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(obj, key, val) {
        this.walk(val)//如果val是对象，那么会触发walk方法将对象内的所有值有转换成响应式
        let _this = this

        let dep = new Dep()

        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)//收集依赖
                return val
            },
            set(newValue) {
                if (newValue === val) return
                val = newValue
                _this.walk(newValue)
                dep.notify()
                //发送通知
            }
        })
    }
}