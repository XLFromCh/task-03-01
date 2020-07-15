class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compiler(this.el)
    }
    //编译模板，处理文本和元素节点
    compiler(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) this.compilerText(node)
            else if (this.isElementNode(node)) this.compilerElement(node)

            if (node.childNodes && node.childNodes.length) this.compiler(node)
        })
    }
    //编译元素节点
    compilerElement(node) {
        //console.log(node.attributes)
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        if (attrName.startsWith('on')) {
            console.log(attrName)
            let eventType = attrName.split(":")[1]

            this.onUpdater.call(this, node, eventType, key)
            return
        }
        let updateFn = this[`${attrName}Updater`]
        //updateFn(node, node[key])
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    onUpdater(node, eventType, key) {
        const eventName = `on${eventType}`
        node[eventName] = this.vm[key].bind(this.vm, arguments)

    }

    htmlUpdater(node, value, key) {
        node.innerHTML = value
        new Watcher(this.vm, key, (value) => {
            node.innerHTML = value
        })
    }
    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (value) => {
            node.textContent = value
        })
    }

    modelUpdater(node, value, key) {
        node.value = value

        node.addEventListener("input", () => {
            this.vm[key] = node.value
        })

        new Watcher(this.vm, key, (value) => {
            node.value = value
        })
    }

    compilerText(node) {
        //console.dir(node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }


    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
}