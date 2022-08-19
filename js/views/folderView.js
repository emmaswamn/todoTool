import View from './View.js';
import taskView from './taskView.js';
import inputView from './inputView.js';
import icons from 'url:../../img/sprite.svg';

class FolderView extends View{
    _parentElement = document.querySelector('.folder__lists');
    _folderParent = null;

    render(data,isMain=true,clear=true){
        this._data = data;
        let markup = this._generateMarkup(isMain);

        if(!isMain){
            this._folderParent.insertAdjacentHTML('afterbegin',markup);
            return;
        }

        if(clear) this._clear();
        if(isMain) this._parentElement.insertAdjacentHTML('afterbegin',markup);
        // inputView.render(this._parentElement);
        // if(!isMain) {
        //     const activeFolder = this._parentElement.querySelector('.folder__title--active');
        //     if (activeFolder.closest('.folder__secondary')){

        //     }
        // }

    }

    activeHandler(handler){
        this._parentElement.addEventListener('click',function(e){
            // active folder
            if(!e.target.closest('.folder__name')) return;
            handler(e.target.closest('.folder__name').textContent.slice(0,-3));
        })
    }

    addFolderHandler(){
        const addBtnGroup = this._parentElement.closest('.folders').querySelector('.folder__classes');
        
        addBtnGroup.addEventListener('click',e =>{
            if(!e.target.closest('.addfolder')) return;

            const activeFolder = this._parentElement.querySelector('.folder__title--active');
            // 1 无active,那么是在folder__lists最上面出现input，输入后，监听回车
            // folderlist 里afterbegin插入最新的folder
  
            if(!activeFolder){
                this._folderParent = this._parentElement;
                inputView.render(this._folderParent,true);
            }

            // 2 有active，folder__main和folder__secondary都是在下面ul中出现Input,
            // ul中添加afterbegin，
            if(activeFolder){
                if(activeFolder.closest('.folder__secondary')){
                    this._folderParent = activeFolder.closest('.folder__secondary').querySelector('.folder__list-items');
                    inputView.render(this._folderParent,false,false);
                    return;
                }
                if(activeFolder.closest('.folder__main')){
                    const foldName = activeFolder.closest('.folder__main').querySelector('.folder__name').textContent.slice(0,-3);
                    if(foldName === '默认分类') return;
                    this._folderParent = activeFolder.closest('.folder__main').querySelector('.folder__list-items');
                    inputView.render(this._folderParent,false,false);
                }
            }

        });

    }

    ////////////////////////////////////////////////////////////////////
    // 激活文件夹 
    /**
     * 
     * @param {Object} folder Find the folder__name in Dom,add active class
     * @param {Object | Object[]} sideFolder An array of secondary folders, render in the Dom
     * @param {Boolean} isMain Default active the main folder, if false active 'folder__secondary'
     * @returns 
     */
    activeFolder(folder,sideFolder=[],isMain=true){
        // 1.找到输入folder{}所在的element
        const allfolders = Array.from(this._parentElement.querySelectorAll('.folder__name'));
        const activeFolder = allfolders.find(ele => ele.textContent.slice(0,-3) === folder.name);

        // 2.找到当前active的folder
        const deadFolder = this._parentElement.querySelector('.folder__title--active');

        // 3.如果相同，则去掉active的classlist中的active，并且删除其内部的tasklist和folderlist
        // 给新folder添加class并渲染folderlist和tasklist
        if(!deadFolder){
            // 关闭次级文件夹后，再次点击mainfolder，防止再一次渲染内容
            const className = activeFolder.closest('.folder__secondary') ? '.folder__secondary' : '.folder__main';
            const curActiveFold = activeFolder.closest(className);

            // 在无active的情况下，只点击次级文件夹，渲染位置应该在次级文件夹下
            const isMain = (className === '.folder__main');
            if(!curActiveFold.querySelector('.folder__list-items')) {
                // 1)初始化页面，没有active的folder,直接给默认分类添加active
                // 也有可能是再次点击active的folder,去掉了active，就不一定是默认分类了
                this._addRemoveActive(activeFolder);

                this._renderTaskSideFol(folder,sideFolder,activeFolder,isMain);
                return;
            };

            // 如果已渲染过，再点击的时候，不会添加active，只会删除文件夹内渲染的内容
            if(curActiveFold.querySelector('.folder__list-items')){
                const deleteDom = curActiveFold.querySelector('.folder__list-items');
                deleteDom.remove();
            }
            return;
        }

        // activeFolder是h4元素，deadFolder是span元素，不能用isequannode,所以这里提取了foldername
        const className = deadFolder.closest('.folder__secondary') ? '.folder__secondary' : '.folder__main';
        // const deadText = deadFolder.querySelector('.folder__name').textContent.slice(0,-3);
        const deadText = deadFolder.textContent.slice(0,-3)
        const activeText = activeFolder.textContent.slice(0,-3);
        

        // 2)点击已经active的folder
        if (deadText === activeText){
            // console.log('in');
            // 删除已activefolder中的tasklist和folderlist（都在folder__list-items里面）
            const deleteDom = deadFolder.closest(className).querySelector('.folder__list-items');
            deleteDom.remove();

            // 删除active
            this._addRemoveActive(activeFolder,false);
        }

        // 3)点击别的未active的folder
        if(deadText !== activeText){
            // 去掉deadFolder的classlist中的active
            deadFolder.classList.remove('folder__title--active');

            // 给点击分类添加active
            this._addRemoveActive(activeFolder);

            // 点击的是不是已打开的文件夹，是否有.folder__list-items了
            // render Task and sidefolder
            const isOpen = activeFolder.closest(`${isMain ? '.folder__main': '.folder__secondary'}`).querySelector('.folder__list-items');
            if (!isOpen) this._renderTaskSideFol(folder,sideFolder,activeFolder,isMain);
            
            return;
        }
    }

    _addRemoveActive(activeFolder,add=true){
        if(add){
            // 给点击分类添加active
            // const addTitle = activeFolder.closest('.folder__title');
            // addTitle.classList.add('folder__title--active');
            activeFolder.classList.add('folder__title--active')
            return;
        }
        // const removeTitle = activeFolder.closest('.folder__title');
        // removeTitle.classList.remove('folder__title--active');
        activeFolder.classList.remove('folder__title--active')
    }

    _renderTaskSideFol(folder,sideFolder,activeFolder,isMain=true){
        // render folder
        const isEmp = folder.hasOwnProperty('folderList');
        const markup = this._generateFolderList(sideFolder,isEmp);
        const className = isMain ? '.folder__main' : '.folder__secondary';
        const parent = activeFolder.closest(className);
   
        parent.insertAdjacentHTML('beforeend',markup);
        
        // render Task
        taskView.render(folder);
        
    }

    _generateFolderList(sideFolder,isEmp=false){
        if(isEmp)
            return`
        <ul class="folder__list-items">
            ${sideFolder.map(fol => this._generateFolderMarkup(fol,false)).join('')}
        </ul>
            `
        return`
        <ul class="folder__list-items"></ul>
        `
    }
    
    ////////////////////////////////////////////////
    // 生成文件夹
    _generateFolderMarkup(folder,isMain=true){
        if(isMain)
        return`
        <li class="folder__main">
            <span class="folder__title" data-num="${folder.totalUndo}">
                <div class="folder__group">
                    <div>
                        <svg class="icon icon--folder">
                            <use xlink:href="${icons}#文件夹"></use>
                        </svg>
                    </div>
                    <h4 class="folder__name">${folder.name}(<span class="number">${folder.totalUndo}</span>)</h4>
                </div>
                <div>
                    <svg class="icon icon--delete hidden">
                        <use xlink:href="${icons}#错误"></use>
                    </svg>
                </div>
            </span>
        </li>
        `;
        return`
        <li class="folder__secondary">
            <span class="folder__title" data-num="${folder.totalUndo}">
                <div class="folder__group">
                    <div>
                        <svg class="icon icon--folder">
                            <use xlink:href="${icons}#文件夹" data-anchor="#icon-search"></use>
                        </svg>
                    </div>
                    <h4 class="folder__name">${folder.name}(<span class="number">${folder.totalUndo}</span>)</h4>
                </div>
                <div>
                    <svg class="icon icon--delete hidden">
                        <use xlink:href="${icons}#错误"></use>
                    </svg>
                </div>
            </span>
        </li>
        `
    }

    _generateMarkup(isMain){
       return this._data.map(folder => this._generateFolderMarkup(folder,isMain)).join('');
    }
}

export default new FolderView();