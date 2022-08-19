import editorView from "./editorView.js";

class TodoView{
    _parentElement = document.querySelector('.todolist');
    _btnGroup = document.querySelector('.btn--todo');
    _task;

    render(task){
        this._task = task;
        let markup = this._generateTodoListMarkup(task);

        this._clear();
        this._parentElement.insertAdjacentHTML('beforeend',markup);
    }

    filterTodoHandler(handler){
        this._btnGroup.addEventListener('click', e => {
            if(!e.target.closest('.btn')) return;

            this._btnGroup.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btn--active'));
            e.target.classList.add('btn--active');
            // this.renderBtn(e.target.textContent);

            const activeTask = document.querySelector('.folder__title--active');
            if(!activeTask.classList.contains('task__name')) return;
            
            const filterEnd = this._filterTodo(activeTask.textContent.slice(0,-3),e.target.textContent);
            
            // console.log(filterEnd);
            handler(...filterEnd);
        });
    }

    addtodoHandler(){
        const addTodoBtn = document.querySelector('.tasklists__add');
        addTodoBtn.addEventListener('click',function(){
            const activeItem = document.querySelector('.folder__title--active');
            if(!activeItem.classList.contains('task__name')) return;
            editorView.render('');
        });
    }

    renderBtn(){
        this._btnGroup.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btn--active'));
        this._btnGroup.querySelector('.btn').classList.add('btn--active');
    }

    activeTodo(handler){
        this._parentElement.addEventListener('click', e => {
            if(!e.target.closest('.todo__item')) return;
            this._parentElement.querySelectorAll('.todo__item').forEach(ele => ele.classList.remove('todo__item--clicked'));
            e.target.classList.add('todo__item--clicked');
            handler(e.target.textContent);
        });
    }

    _filterTodo(taskname,filter){
        if(filter === '所有') return [taskname,false];
        if(filter === '未完成') return [taskname,true,false];
        if(filter === '已完成') return [taskname,true,true];
    }

    _generateTodoListMarkup(task){
        if(!task) return'';
        let markup='';
        for(let key in task){
            // console.log(key,task[key]);
           const halfMark = this._generateMarkup(key,task[key]);
           markup += halfMark;
        }
        return markup;
    }

    _generateMarkup(time,todolist){
        return `
        <li class="todolist__item">
            <div class="todo__date">${time}</div>
            <ul class="todo__items">
                ${todolist.map(todo => this._generateTodoItem(todo)).join('')}
            </ul>
        </li>
        `;
    }

    _generateTodoItem(todo){
        return`
                <li class="todo__item ${todo.isDone ? 'todo__item--done' : 'todo__item--undo'}">${todo.name}</li>  
        `;
    }

    _clear(){
        this._parentElement.innerHTML='';
    }
}

export default new TodoView();