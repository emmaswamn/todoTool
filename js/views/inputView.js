
class inputView{
    _parentElement = document.querySelector('.folder__lists');
    _isMain = false;
    _foldParent = null;
    _addTask = false;

    render(parent,isMain,addTask,place='afterbegin'){
        this._isMain = isMain;
        const markup = this._generateMarkup();
        parent.insertAdjacentHTML(place,markup);
        this._foldParent = parent;
        this._addTask=addTask;
    }

    // submit有Bubble phase 不一定要监听form
    submitHandler(handler){
        this._parentElement.addEventListener('submit',e => {
            e.preventDefault();

            //获取输入的值
            const inputValue = e.target.querySelector('.nameInput').value.trim();

            // 数据验证
            const isValid = this._inputValidation(inputValue);
            if(!isValid) return;

            // 提取parent文件夹名称
            const className = this._foldParent.closest('.folder__secondary') ? '.folder__secondary' : '.folder__main';
            const parentFold = this._foldParent.closest(className);
            let parentName = null;
            if (parentFold) {
                parentName = parentFold.querySelector('.folder__name').textContent.slice(0,-3);
            }
            const result = handler(inputValue,this._isMain,parentName,this._addTask);
            if(result) this._removeInput();
        });
    }

    cancelInput(){
        this._parentElement.closest('.folders').addEventListener('click',e =>{
            if(!e.target.closest('.folder__lists') && !e.target.closest('.folder__classes')) this._removeInput();
        });
    }
    
    _inputValidation(inputValue){
        if(inputValue === ''){
            alert('请输入内容！');
            return false;
        }
        if(inputValue.length > 10){
            alert('文件名过长');
            return false;
        }
        return true;
    }

    _removeInput(){
        const inputDom = this._parentElement.querySelector('.form');
        if(inputDom) inputDom.remove();
    }

    _generateMarkup(){
        return`
        <form class="form">
            <li>
                <input type="text" class="nameInput" maxlength="10">
            </li>
            <button class="hidden"></button>
        </form>
        `
    }
}

export default new inputView();
