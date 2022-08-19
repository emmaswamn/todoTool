import * as model from './model.js';
import folderView from './views/folderView.js';
import taskView from './views/taskView.js';
import inputView from './views/inputView.js';
import undoView from './views/undoView.js';
import removeFoldView from './views/removeFoldView.js';
import modalView from './views/modalView.js';
import todoView from './views/todoView.js';
import editorView from './views/editorView.js';


const loadFolder = function(){
    model.addSum();
    folderView.render(model.state.mainFolder);
    const foldData = model.getfolder('默认分类');
    folderView.activeFolder(foldData);  
    undoView.updateTotalSum();
};


const selectFolderController = function(folderName){
    const isMain = model.getfolder(folderName) ? true : false;
    const foldData = model.getfolder(folderName,isMain);
    if(!foldData.hasOwnProperty('folderList')){
        folderView.activeFolder(foldData,[],isMain);
        return;
    }
    const sideFolder = foldData.folderList.map(fol =>{ 
        // console.log(fol);
        // console.log(model.state.secondaryFolder);
        return model.getfolder(fol,false);
    });
    // console.log(sideFolder);
    folderView.activeFolder(foldData,sideFolder,isMain);
};

const addInputController = function(inputValue,isMain,parentName,addTask){
    if(!addTask){   
        const isExist = model.getfolder(inputValue) || model.getfolder(inputValue,false);

        if(isExist){
            alert('文件名重复,请重新输入！');
        }else{
            model.addFolder(inputValue,isMain);
            model.persistFolders();
            const fold = isMain ? 'mainFolder' : 'secondaryFolder';
            folderView.render([model.state[fold][0]],isMain,false);
            
            // 在parent folder的folderlist里添加新的文件夹名称
            if(parentName) {
                // console.log(parentName);
                model.addFolderList(parentName,inputValue)
                // let parentFold = model.state.mainFolder.find(fold => fold.name === parentName);
                // if(!parentFold) parentFold = model.state.secondaryFolder.find(fold => fold.name === parentName);
                // parentFold.folderList.unshift(inputValue);
                model.persistFolders();
            }

            // console.log(model.state.secondaryFolder);

            return true;
        }
    }
    if(addTask){
        const isExist = model.getTaskLisk(inputValue);

        if(isExist){
            alert('任务名重复,请重新输入！');
        }else{            
            // 在parent folder的tasklist里添加新的task名称

            
            // console.log(parentName);
            let parentFold = model.state.mainFolder.find(fold => fold.name === parentName);
            if(!parentFold) parentFold = model.state.secondaryFolder.find(fold => fold.name === parentName);
            parentFold.tasklist.push({
                taskName:inputValue,
                sum:0
            })
            // model.addTask(parentName,inputValue);
            model.persistFolders();

            taskView.render(parentFold,true);
            taskView.activeTask(inputValue);

            return true;
        }
    }
};

const todoListController = function(taskname, filter=false,isDone=false){
    const todolist = model.getTodoList(taskname, filter,isDone);
    // console.log(todolist);
    todoView.render(todolist);
};

const addTaskController = function(taskname){
    // console.log(taskname);
    todoListController(taskname);
    todoView.renderBtn();
    editorView.render('',false,true);
};

const deleteFolderController = function(folderName){
    model.deleteFolder(folderName);
    model.persistFolders();
    loadFolder();
    modalView.closeDialog('delete');
};

const showTodoController = function(todoName){
    const todo = model.getTodo(todoName);
    editorView.render(todo,false);
};

const editTodoController = function(name){
   return model.getTodo(name) ? true :false;
};

const reloadWhole = function(type){
    loadFolder();
    todoView.render('');
    editorView.render('',false,true);
    modalView.closeDialog(type);
}
const confirmDoneController = function(todo){
    // console.log(todo);
    model.todoDone(todo);
    // console.log(model.state.todolist);
    model.presistTodo();

    reloadWhole('done');
};


const addTodoController = function(){
    const newTodo = editorView.getInputTask();
    model.state.todolist.push(newTodo);

    model.presistTodo();
    reloadWhole('add');
};

const editConfirmController = function(){
    const changedTodo = editorView.getInputTask();
    // console.log(changedTodo);
    // console.log(model.state.todolist);
    let todoIndex = model.state.todolist.findIndex(todo => todo.name === changedTodo.name);
    model.state.todolist.splice(todoIndex,1,changedTodo);
    // console.log(model.state.todolist);

    model.presistTodo();
    reloadWhole('edit');
}

const init = function(){
    loadFolder();
    folderView.activeHandler(selectFolderController);
    folderView.addFolderHandler();
    taskView.activeTaskHandler(addTaskController);
    taskView.addTaskHandler();
    inputView.submitHandler(addInputController);
    inputView.cancelInput();
    removeFoldView.showHideDelete();
    modalView.confirmDeleteHandler(deleteFolderController);
    todoView.filterTodoHandler(todoListController);
    todoView.activeTodo(showTodoController);
    todoView.addtodoHandler();
    editorView.addEditorTodo(editTodoController);
    modalView.confirmDoneHandler(confirmDoneController);
    modalView.confirmAddHandler(addTodoController);
    modalView.confirmEditHandler(editConfirmController);
};
  
init();
