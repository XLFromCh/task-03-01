class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compiler(this.el);
  }
  //编译模板，处理文本和元素节点
  compiler(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) this.compilerText(node);
      else if (this.isElementNode(node)) this.compilerElement(node);

      if (node.childNodes && node.childNodes.length) this.compiler(node);
    });
  }
  //编译元素节点
  compilerElement(node) {
    //console.log(node.attributes)
    Array.from(node.attributes).forEach((attr) => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2);
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }

  update(node, key, attrName) {
    let uodateFn = this[`${attrName}Updater`];
    //uodateFn(node, node[key])
    uodateFn && uodateFn.call(this, node, this.vm[key], key);
  }

  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (nv) => {
      node.textContent = nv;
    });
  }

  modelUpdater(node, value, key) {
    node.addEventListener("input", () => {
      this.vm[key] = node.value;
    });
    node.value = value;
    new Watcher(this.vm, key, (nv) => {
      node.value = nv;
    });
  }

  compilerText(node) {
    //console.dir(node)
    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);

      new Watcher(this.vm, key, (nv) => {
        node.textContent = nv;
      });
    }
  }
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  isTextNode(node) {
    return node.nodeType === 3;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
