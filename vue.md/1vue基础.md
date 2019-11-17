# Vue 基础

## 1 Vue 简介

* Vue (读音 /vju:/ ,类似于 view) 是一套用于构建用户界面的渐进式框架。

  vue-core + vue-router + vuex + webpack

  库 VS 框架          框架>库

## 2 Vue 基本使用

### 2.1 下载

* npm install vue 或者官网下载

### 2.2 引用

* ```html
  <script src="./node_modules/vue/dist/vue.js"></script>
  ```

### 2.3 实例化

* ```html
  <!-- view -->
  <div id="app">
      {{ msg }}  <!-- {{}} 为插值表达式，可以取值，运算，三元运算符，函数调用等等... -->
      {{ info }}
      {{ obj.a }}
      {{ obj.b }}
      {{ obj.c }}
  </div>
  <script src="./node_modules/vue/dist/vue.js"></script>
  <script>
      // 实例化vue
      // vue 属于 MVVM  model--数据  view--视图  viewmodel--视图模型
      let vm = new Vue({  // viewmodel
          el : "#app",  // DOM元素
          data : {  //model
              msg : "hello vue",
              info : "vue 2.6.10",
              obj : {
                  a : 1,
                b : 2
              } 
          }
      })
      // vm 实例 代理了 data 中的数据
      console.log(vm.msg);  // 获取数据，直接使用 vm.****
      console.log(vm.$data);  // 获取data数据对象
      console.log(vm.$el);  //
      console.log(vm.$options);  //
      // 数据驱动视图 数据改变 视图会自动更新
     
      //vm.obj.c = 3;  //此方法给对象增加一个属性，但是不是响应式的
      vm.$set(vm.obj, "c", 3);  //使用$set方法，为响应式对象增加一个属性
      /*
          v----vm----m
      */    
  </script>
  ```
  
* 数据驱动视图 数据改变 视图会自动更新 的原理 使用 es5 的 `Object.defineProperty()` 方法

  ```javascript
  // 定义一个对象
  let obj = {
      name : "zhangsan",
      age : "20",
      hobby : ["football","pingpang"],
      info : {
          a : 20
      }
  }
  //  Object.defineProperty() 数据劫持
  function observe(obj) {
      if (typeof obj === "object") {
          //重新定义属性
          for (let key in obj){
              defineReactive(obj, key, obj[key])
          }
      }
  }
  function defineReactive(obj,key,value){
      observe(value);  // 如果属性值也是对象，也需要被监视
      Object.defineProperty(obj, key, {
          get() {  //获取时调用 get 方法
              console.log("数据被访问了")
               return value;
          },
          set(newVal) {  //修改时调用 set 方法
              observe(newVal);  // 如果设置的值也是对象，也需要被监视
              value = newVal;
              console.log("视图更新了")
          }
      })
  }
  observe(obj);
  console.log(obj.age);
  obj.name = "lisi";
  obj.info = {b:20};
  obj.info.b = 30;
  // 重写数组的方法
  let arrMethods = ["push","shift","unshift"];
  arrMethods.forEach((method) => {
      let oldMethod = Array.prototype[method];
      Array.prototype[method] = (val) => {
          console.log("视图更新了");
          oldMethod.call(this,val);
      }
  })
  obj.hobby.push("basketball");  // 如果属性值是数组，需要重写数组方法 
  ```
  

### 2.4 Vue 指令

* `v-once`  --内部进行缓存 以后每次使用的都是缓存的结果

  ```html
  <!--  v-once 内部进行缓存，以后每次使用都是缓存的结果  -->
  <div v-once>{{ info }}</div>
  ```

* `v-html`  --相当于 `innerHTML`  数据可以支持标签 此方法容易引起XSS攻击，如果是输入框，则不建议使用

  ```html
  <!--  v-html innterHTML XSS攻击 -->
  <div v-html="d"></div>
  ```

* `v-text`  --相当于 `innerText`

  ```html
  <!--  v-text 相当于 innterText  -->
  <div v-text="d"></div>
  ```

* `v-if`  --控制元素的显示与隐藏 它的原理是元素创建与销毁

  ```html
  <div v-if="flag">abc</div>
  ```

* `v-show`  -- 控制元素的显示与隐藏 它的原理是 `display:none/block`  如果频繁的显示与隐藏，建议使用此方法

  ```html
  <div v-show="flag">abc</div>
  ```

* `template`  --vue内置标签，不会渲染到DOM里面 对 `v-show` 指令不支持

  ```html
  <template v-if="flag">
      <p>111</p>
      <p>222</p>
  </template>
  ```

* `v-else`  --配合 `v-if` 来使用

  ```html
  <template v-if="flag">
      <p>111</p>
      <p>222</p>
  </template>
  <template v-else>
      <p>555</p>
      <p>666</p>
  </template>
  ```

* `v-for`  --循环 循环谁就放在谁身上  可以循环对象和数组

  ```html
   <!-- 演示 key 的重要性 -->
  <!--  key 区分元素，尽量使用唯一标识，尽量不要使用index  -->
   <div v-if="flag">
      <span>aaaaa</span>
      <input type="text" key="1" />
  </div>
   <div v-else>
      <span>bbbbb</span>
      <input type="text" key="2" />
  </div>
  ```

  ```html
  <ul>
      <!--  key 是唯一标识符 是为了区分每个元素的唯一性，不建议使用index,可以使用后台数据传过来的 id  -->
      <li v-for="(hobby,index) in hobbies" :key="hobby">{{ index }} {{ hobby }}</li>
  </ul>
   <!-- 使用 es6 新语法 for of  也可以 -->
  <ul>
      <li v-for="(hobby,index) of hobbies" :key="hobby">{{ index }} {{ hobby }}</li>
  </ul>
  ```

* `v-bind`  --绑定属性  是单项数据绑定  可以直接简写为 `:`

  ```html
   <!-- 如果要实现双向数据绑定，需要配合oninput 事件 -->
  <!-- v-on 事件绑定 -->
  <!--  v-bind: value= :value    v-on:input=@input -->
  <!-- <input type="text" v-bind:value="msg" v-on:input="(e) => {msg=e.target.value}" /> -->
  <input type="text" :value="msg" @input="(e) => {msg=e.target.value}" />
  ```

* `v-model`  --双项数据绑定

  ```html
  <!-- 文本框 -->
  <input type="text" v-model="msg" />
  <br/> 
  {{ msg }} 
   <br/>
  <!-- 下拉列表 -->
   <select v-model="selectValue">
  <option value ="0" disabled>--前选择--</option>
  <option v-for="(list, key) in lists" :key="list.id" :value="list.id">{{ list.title }}</option>
  </select>
  <br/>
   <!-- 单选框 -->
  <input type="radio" v-model="radioValue" value="男" /> 男
  <input type="radio" v-model="radioValue" value="女" /> 女
   <br/>
  <!-- 复选框 -->
  <input type="checkbox" v-model="checkValues" value="running"/>游泳
  <input type="checkbox" v-model="checkValues" value="eating"/>吃饭
  <input type="checkbox" v-model="checkValues" value="learning"/>学习
  <br/>
  {{ checkValues }}
  <script src="../node_modules/vue/dist/vue.js"></script>
  <script>
      let vm = new Vue({
          data: {
              msg : "hello",
              selectValue : 0,
              radioValue : "男",  
              checkValues : [],
              lists : [{id : 1, title : "项目一"},{id : 2, title : "项目二"},{id : 3, title : "项目三"},]
          }
      }) .$mount('#app');  // 等于 el : "#app";
  </script>
  ```

  ```html
  <!-- v-model 的修饰符 .number 指定为numberl类型  .trim 去掉前后空格 -->
  <input type="text" v-model.number="val">{{ val +4 }}
   <!--  .lazy 在默认情况下，v-model 在每次 input 事件触发后将输入框的值与数据进行同步 (除了上述输入法组合文字时)。你可以添加 lazy 修饰符，从而转变为使用 change 事件进行同步：-->
  <input type="text" v-model.lazy="val">{{ val }}
   <script src="../node_modules/vue/dist/vue.js"></script>
  <script>
      let vm = new Vue({
          data: {
              val : 6,
          }
      }) .$mount('#app');  // 等于 el : "#app";
  </script>
  ```

### 2.5 Vue 使用样式

```html
<div id="app">
    <!-- 增加一个类名 v-bind:class -->
    <div class="aaa" :class="className"></div>
    <!-- 满足一定条件，增加一个类名 {类名 : 条件 } -->
    <div class="aaa" :class="{ccc: flag}"></div>
    <!-- 增加多个类名，使用数组 [] , 并且可以和其它混合使用 -->
    <div class="aaa" :class="[{ccc: flag},'ddd', className]"></div>
<!-- 直接使用样式  :style={ , , ,}-->
<p style="color:red" :style="{background:'blue',fontSize:'20px'}">123456</p>
</div>
<script src="../node_modules/vue/dist/vue.js"></script>
<script>
    let vm =new Vue({
        data : {
            className : "bbb",
            flag : true
        }
    }).$mount("#app");
</script>
```

### 2.6 `computed`(计算属性) & `watch`(数据监听)

```html
<div id="app">
    {{ getInfo }} <br/>
    {{ num }}
</div>
<script src="../node_modules/vue/dist/vue.js"></script>
<script>
     let vm =new Vue({
         data : {
              foo : "hello ",
              bar : "world",
              num : 10,
              getInfo : ''
         },
         // 方法不会缓存
        /*  methods : {
                  getInfo() {
                      console.log("method is called");
                      return this.foo + this.bar;
                  }
              }, */
        // 计算属性 本质上是一个方法，用的时候当作属性来用
        // 计算属性具有缓存
        // 只有当其依赖的数据成员改变时，才会重新渲染
        /* computed : {  // 底层方法：Object.defineProperty()
                 getInfo() {
                     console.log("method is called");
                     return this.foo + this.bar;
                 }
        }, */
        // watch VS computed
        // 1. 尽量优先使用 computed  代码简洁
        // 2. watch 支持异步，computed 不支持，需要异步实现的，就使用 watch
        watch : {
           /*  foo(newValue,oldValue) {
                   this.getInfo = this.foo + this.bar;
            },
            bar(newValue,oldValue) {
                this.getInfo = this.foo + this.bar;
            } */
            foo : {
                handler() {  //handler()方法名字是固定的，不能改变
                    setTimeout(()=>{  // 比如延时更新，只能使用 watch
                        this.getInfo = this.foo + this.bar;
                    },1000)
                },
                immediate : true  // 立即执行
            },
            bar : {
                handler() {  //handler()方法名字是固定的，不能改变
                    this.getInfo = this.foo + this.bar;
                },
                immediate : true  // 立即执行
            }
        }
    }).$mount("#app");
 </script>
```

```html
<!-- comouted 一应用实例 -->
 <div id="app">
        <input type="checkbox" v-model="checkAll"/>全选<br/>
        <input type="checkbox" v-for="(check,key) in checks" v-model="check.value"/>
    </div>
    <script src="../node_modules/vue/dist/vue.js"></script>
    <script>
    let vm =new Vue({
        data : {
            checks : [{value : true},{value : false},{value : true}]
        },
        computed : {
            checkAll : {
                get() {
                    //every()方法，遍历数组，直到遇到第一个是false的，就结束遍历，返回false,如果都是ture,就返回true
                    return this.checks.every((check)=>{
                        return check.value;
                    })
                },
                set(val) {
                    return this.checks.forEach((check) => {
                        check.value = val;
                    })
                }
            }
        }
    }).$mount("#app");
</script>
```



