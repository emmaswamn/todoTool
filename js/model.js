export const state={
    todolist:[
        {
            name:'to-do 1',
            time:'2015-3-5',
            description:'完成任务',
            isDone:false,
            taskName:'task1'
        },
        {
            name:'to-do 2',
            time:'2015-3-5',
            description:'完成任务',
            isDone:false,
            taskName:'task1'
        },
        {
            name:'to-do 3',
            time:'2015-3-6',
            description:'完成任务',
            isDone:false,
            taskName:'task1'
        },
        {
            name:'to-do 4',
            time:'2015-3-6',
            description:'完成任务',
            isDone:true,
            taskName:'task2'
        },
        {
            name:'to-do 5',
            time:'2015-3-7',
            description:'完成任务',
            isDone:false,
            taskName:'task3'
        },
    ],
    mainFolder:[
        {
            name:'百度IFE项目',
            folderList:['新建文件夹'],
            tasklist:[
                {taskName:'task1',
                sum:0},
                {taskName:'task2',
                sum:0}
            ],
            totalUndo:0
        },
        {
            name:'毕业设计',
            folderList:[],
            tasklist:[],
            totalUndo:0
        },
        {
            name:'默认分类',
            tasklist:[{taskName:'task4',sum:0},{taskName:'task5',sum:0}],
            totalUndo:0
        },
    ],
    secondaryFolder:[
        {
            name:'新建文件夹',
            folderList:[],
            tasklist:[{taskName:'task3',sum:0}],
            totalUndo:0
        }
    ]

};

export const todoDone = function(todoname){
    const todoIndex = state.todolist.findIndex(todo => todo.name === todoname);
    state.todolist[todoIndex].isDone = true;
};

export const getTodo = function(todoname){
    const todo = state.todolist.slice().find(to => to.name === todoname);
    return todo;
};

// 获取todolist
export const getTodoList = function(taskname, filter=false,isDone=false){
    let todolist = state.todolist.filter(todo => todo.taskName === taskname);

    
    if(filter) {
        if(isDone) todolist = todolist.filter(todo => todo.isDone === true);
        if(!isDone) todolist = todolist.filter(todo => todo.isDone === false);
    }

    if(!todolist) return todolist;

    todolist = groupbyTodo(todolist);
    return todolist;
};

const groupbyTodo = function(todolist,property = 'time'){
    return todolist.reduce(function (acc, obj) {
      let key = obj[property]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {})
};


// 获取具体文件夹
export const getfolder = function(folderName,isMain=true){
    if(isMain) {
        return state.mainFolder.slice().find(fold => fold.name === folderName);
    }
    return state.secondaryFolder.slice().find(fold => fold.name === folderName);
};

// 删除文件夹，及全部内容
export const deleteFolder = function(folderName){
    const isMain = getfolder(folderName) ? true : false;
    let foldlist = deleteFold(folderName,isMain);
    let i = foldlist.length;

    while(i > 0){
        // console.log(i);
        // console.log(foldlist);
        const folder = foldlist.map(fold => deleteFold(fold,false));
        if(folder.length === 1 && !folder[0]){ 
            foldlist = folder[0];
        }else{
            foldlist =folder.reduce((pre,cur) => pre.concat(cur));
        }
        // console.log(foldlist);
        i = foldlist.length;
    }
};

// 目前只能删除main以及内部文件夹
const deleteFold = function(folderName,isMain){
    const aimFolder = getfolder(folderName,isMain);

    // 获取folderlist 和tasklist
    let folderlist,tasklist;
    if(aimFolder.folderList) folderlist = aimFolder.folderList.slice();
    if(aimFolder.tasklist) tasklist = aimFolder.tasklist.map(li => li.taskName);

    // tasklist不为空，清楚todolist中对应的todo
    if(tasklist){
        const todolist = state.todolist.filter(todo =>  !tasklist.includes(todo.taskName));
        state.todolist = todolist;
    }

    // 清除secondary里面有secondary的情况会报错，会先删外面的文件夹
    // 清除文件夹
    if(isMain) state.mainFolder = state.mainFolder.filter(fold => fold.name !== aimFolder.name);
    if(!isMain) {
        let sec = state.mainFolder.find(fold => {
           if(fold.hasOwnProperty('folderList')) return fold.folderList.includes(folderName);
        });
        if(!sec) sec = state.secondaryFolder.find(fold => fold.folderList.includes(folderName));

        if(sec){       
            console.log(sec);
            console.log(sec.folderList);
            const index = sec.folderList.findIndex(acc => acc === folderName);
            console.log(index);
            sec.folderList.splice(index,1);
        }

        state.secondaryFolder = state.secondaryFolder.filter(fold => fold.name !== aimFolder.name);
    };

    return folderlist;
};

// 获取Task中未完成任务个数
const undoSum = function(taskName){
   const filteredList = state.todolist.filter(todo => todo.taskName === taskName && todo.isDone === false);
   return filteredList.length;
};

// TaskList
export const getTaskLisk = function(taskName){
    const maintask = state.mainFolder.map(fold => fold.tasklist)
                        .reduce((pre,cur) => pre.concat(cur));
    const secondaryTask = state.secondaryFolder.map(fold => fold.tasklist)
                        .reduce((pre,cur) => pre.concat(cur));
    const tasklist = maintask.concat(secondaryTask);
    
    const findTask = tasklist.find(task => task.taskName === taskName);

    return findTask;
}

// 没有下级文件夹时，文件夹内未完成个数 有夏季文件夹时。。。。
// secondaryfolder要在开头加新文件夹，这样后面包含它的文件夹才能得到最新的totalUndo
// 新增mainfolder是在头部添加
// mainfolder的folderlist也是在头部添加
// mainfolder的添加应该也是在folders最顶部出现输入框，然后添加到mainfolder的头部，添加单个是afterbegin
// 新增task是在tasklist的尾部添加的
const undoTaskSum = function(folder){
    let sum = 0;
    if(folder['tasklist'].length > 0){
        sum = undoCaclSum(folder);
       if(!folder.hasOwnProperty('folderList') || folder.folderList.length === 0){
        folder.totalUndo = sum;
       }
    }
    if(folder.hasOwnProperty('folderList') && folder.folderList.length > 0){
        const secfold = folder.folderList.map(fold => {
            const result = state.secondaryFolder.find(fod => fod.name === fold);
            return result;
        })
        // console.log(secfold);
        const sumNum = secfold.map(sec => {
            return sec.totalUndo;
        }).reduce((pre,cur)=> pre + cur);
        folder.totalUndo = !sum ? sumNum : sum + sumNum;
    }
};


// 使用undoSum计算folder中task的未完成数量
const undoCaclSum = function(folder){
    let sum=0;
    folder['tasklist'] = folder['tasklist'].map(task => {
        const num = undoSum(task.taskName);
        sum += num;
        const newTask ={
            taskName:task.taskName,
            sum:num
        };
        
        return newTask;
    });

    return sum;
};

// 先算最近添加下级文件夹的未完成个数，一路向上
export const addSum = function(){
    state.secondaryFolder.forEach(function(folder){
        undoTaskSum(folder);
    });
    state.mainFolder.forEach(function(folder){
        undoTaskSum(folder);
    });
};

// 添加主文件夹也是添加到头部的
export const addFolder = function(folderName,isMain){
    const foldObj = {
        name:folderName,
        folderList:[],
        tasklist:[],
        totalUndo:0
    };

    if(isMain) state.mainFolder.unshift(foldObj);
    
    if(!isMain) state.secondaryFolder.unshift(foldObj);
};

export const addFolderList = function(parentName,inputValue){
    let parentFold = state.mainFolder.find(fold => fold.name === parentName);
    if(!parentFold) parentFold = state.secondaryFolder.find(fold => fold.name === parentName);
    parentFold.folderList.unshift(inputValue);
};

// export const addTask = function(parentName){
//     let parentFold = state.mainFolder.find(fold => fold.name === parentName);
//     if(!parentFold) parentFold = state.secondaryFolder.find(fold => fold.name === parentName);
//     parentFold.tasklist.push({
//         taskName:inputValue,
//         sum:0
//     })
// };

// 存储到本地
export const persistFolders = function(){
    localStorage.setItem('mainFolder',JSON.stringify(state.mainFolder));
    localStorage.setItem('secondaryFolder',JSON.stringify(state.secondaryFolder));
};

export const presistTodo = function(){
    localStorage.setItem('todolist',JSON.stringify(state.todolist));
};

// 从本地取出
const init =function(){
    const storageMain = localStorage.getItem('mainFolder');
    if(storageMain) state.mainFolder = JSON.parse(storageMain);

    const storageSec = localStorage.getItem('secondaryFolder');
    if(storageSec){
        // console.log(JSON.parse(storageSec) instanceof Array);
        // const sec = JSON.parse(storageSec)[0];
        // console.log(sec);
        state.secondaryFolder = JSON.parse(storageSec);
        // state.secondaryFolder[0] = sec;
        // const red = state.secondaryFolder;
        // console.log(red);
        // console.log(state.secondaryFolder);
        
    };

    const storageTodo = localStorage.getItem('todolist');
    if(storageTodo) state.todolist = JSON.parse(storageTodo);
    // addSum();
};

init();

