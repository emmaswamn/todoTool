import View from './View.js';
import inputView from './inputView.js';
import icons from 'url:../../img/sprite.svg';

class TaskView extends View{
    _parentElement = null;

    // data直接输入该folder{} model getfolder
    render(data,isAdd = false){
        this._data = data;

        if(this._data.tasklist.length === 0) return;

        this._parentElement = this._findParent(data);

        const [task] = data.tasklist.slice(-1);
        const markup = !isAdd ? this._generateMarkup() : this._generateTasks(task);
        // console.log(task);
        // console.log(markup);

        this._parentElement.insertAdjacentHTML('beforeend',markup);
    }

    activeTaskHandler(handler){
        const start = document.querySelector('.folder__lists');
        start.addEventListener('click',function(e){
            // console.log(e.target);
            // active folder
            if(!e.target.closest('.task__name')) return;
            const target = e.target.closest('.task__name');
            const curActive = document.querySelector('.folders').querySelector('.folder__title--active');
            
            let setActiveText ='';
            if(curActive){
                const curActiveText = curActive.textContent.slice(0,-3);

                // console.log(curActiveText);
                setActiveText = target.textContent.slice(0,-3);
                // console.log(setActiveText);
                curActive.classList.remove('folder__title--active');
                if(curActiveText !== setActiveText) target.classList.add('folder__title--active');
            }

            handler(setActiveText);
        })
    }

    activeTask(inputValue){
        const folderList = document.querySelector('.folder__lists');
        const curActive = folderList.querySelector('.folder__title--active');
        const allTask = Array.from(folderList.querySelectorAll('.task__name'));
        const newTask = allTask.find(ele => ele.textContent.slice(0,-3) === inputValue);

        curActive.classList.remove('folder__title--active');
        newTask.classList.add('folder__title--active');
    }

    addTaskHandler(){
        const addBtnGroup = document.querySelector('.folder__classes');
        
        addBtnGroup.addEventListener('click',e =>{
            if(!e.target.closest('.addtask')) return;

            const activeFolder = document.querySelector('.folder__title--active');

            // 有active，folder__main和folder__secondary都是在下面ul中出现Input,
            // ul中添加afterbegin，
            if(activeFolder){
                if(activeFolder.closest('.folder__secondary')){
                    this._folderParent = activeFolder.closest('.folder__secondary').querySelector('.folder__list-items');
                    inputView.render(this._folderParent,false,true);
                    return;
                }
                if(activeFolder.closest('.folder__main')){
                    this._folderParent = activeFolder.closest('.folder__main').querySelector('.folder__list-items');
                    inputView.render(this._folderParent,false,true);
                }
            }

        });

    }

    _findParent(folder){
        // 如果时输入整个mainfolder才需要这么找，现在时直接输入找好的文件夹{}
        // const folder = this._data.find(fol => fol.name === fold);

        // Main folders
        const folderLists = document.querySelector('.folder__lists');
        

        const allfolders = Array.from(folderLists.querySelectorAll('.folder__name'));

        const addTaskElem = allfolders.find(ele => ele.textContent.slice(0,-3) === folder.name);

        const className = addTaskElem.closest('.folder__secondary') ? '.folder__secondary' :'.folder__main';

        return addTaskElem.closest(className).querySelector('.folder__list-items');
    }

    _generateMarkup(){
        return`
            ${this._data.tasklist.map(task => this._generateTasks(task)).join('')}
        `
    }

    _generateTasks(task){
        return`
            <li class="task" data-num="${task.sum}">
                <svg class="icon">
                    <use xlink:href="${icons}#文件"></use>
                </svg>
                <h5 class="task__name">${task.taskName}(<span class="number">${task.sum}</span>)</h5>
            </li>
        `
    }
}

export default new TaskView();