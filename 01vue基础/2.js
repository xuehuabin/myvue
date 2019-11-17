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
    //console.log(obj.age);
    //obj.name = "lisi";
    //console.log(obj.name);
    //obj.info = {b:20};
    //obj.info.a = 30;
    
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

    