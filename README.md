#  手写 Vue Router、手写响应式实现、虚拟 DOM 和 Diff 算法

一、简答题
1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
 
 新增成员不是响应式数据
 如果把新增成员设置成响应式数据，它的内部原理为：首先将该属性注入到vue示例，然后创建observer对新添加对象做数据劫持，添加getter和setter方法，getter方法中做依赖收集，在setter方法中调用watcher对象的updata方法通知视图发生变化

2、请简述 Diff 算法的执行过程
    Diff算法只比较同级节点的差异
    1、先比较新开始节点和旧开始节点，若节点相同直接patchVnode并且指针往后移动一位，若不相同则比较新结束节点和旧结束节点
    2、旧结束节点和新结束相同直接patchVnode并且指针前移动一位，若不相同则比较旧开始节点和新结束节点，若相同直接patchVnode并且将旧开始节点移动至最后一位。更新索引
    3、比较旧结束节点和新开始节点，若相同直接patchVnode并将旧结束节点移动至最前面
    4、若以上情况都不满足，在旧节点中寻找与新开始节点相同key的节点，若没找到说明新开始节点是一个新节点，此时创建node并插入旧节点最前。若找到相同key值，在判断是否有相同选择器，若不相同说明节点修改了，重新创建对应dom并插入dom树。若选择器相同，将对应旧节点移动至最前
    5、循环结束之后继续判断，若老节点数据更长，则将新节点数组中未比较的节点直接插入dom树最右。若老节点数量超过新节点数量，老节点中未比较数据直接删除


二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
  https://github.com/XLFromCh/task-03-01/tree/master/01-vue-router-basic-usage
2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令
  https://github.com/XLFromCh/task-03-01/tree/master/my-vue
3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图
  https://github.com/XLFromCh/task-03-01/tree/master/vue-virtual-dom
