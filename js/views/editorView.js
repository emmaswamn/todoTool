import View from "./View.js";
import modalView from "./modalView.js";
import icons from 'url:../../img/sprite.svg';

class EditorView extends View{
    _parentElement = document.querySelector('.editor');
    _inputTodo = null;

    render(data,input = true,clear=false){
        this._data = data;
        // console.log(data.isDone);
        let markup = this._generateMarkup(data,input,clear);

        // console.log(markup);
        this._clear();
        this._parentElement.insertAdjacentHTML('beforeend',markup);
    }

    addEditorTodo(handler){
        this._parentElement.addEventListener('click',e => {
            if(e.target.closest('.icon--done')){
                this._doneBtn(e,handler);
                return;
            }
            if(e.target.closest('.icon--edit')){
                if(e.target.closest('.editor--show')){
                    // 渲染Input
                    // 但是title的Input disable，不可更改
                    // console.log('input');
                    this.render(this._data,true);
                    const name = document.querySelector('.editor__title');
                    const time = document.querySelector('.editor__date-input');
                    const desc = document.querySelector('.editor__description-detail');
                    
                    name.value = this._data.name;
                    time.value = this._data.time;
                    desc.value = this._data.description;
                    name.setAttribute('disabled','disabled');

                    return;
                }
                if(e.target.closest('.editor--input')){
                    // 验证数据是否相同
                    const inputVal = this._inputValidation('',true);

                    if(!inputVal) return;
                    // 如果相同，直接渲染div
                    // console.log(inputVal.description);
                    // console.log(inputVal.time,this._data.time);
                    // console.log(inputVal.description,this._data.description);
                    if(inputVal.time === this._data.time && inputVal.description === this._data.description){
                        this.render(this._data,false);
                        return;
                    }
                    // 如果不相同，显示modal
                    this._inputTodo = inputVal;

                    modalView.showDialog('edit');
                    // 确认则修改todo
                }
            }
        });
    }


    getInputTask(){
        return this._inputTodo;
    }

    _doneBtn(e,handler){
        if(e.target.closest('.editor--show')){
            modalView.showDialog('done');
            return;
        }
        if(e.target.closest('.editor--input')){
            const input = this._inputValidation(handler);
            if(!input) return;

            this._inputTodo = input;

            modalView.showDialog('add');
        }

    }

    _inputValidation(handler,isEdit=false){
        const name = document.querySelector('.editor__title').value.trim();
        const time = document.querySelector('.editor__date-input').value.trim();
        const desc = document.querySelector('.editor__description-detail').value.trim();
        const taskname = document.querySelector('.folder__title--active').textContent.slice(0,-3);

        if(!isEdit){        
            const isNameDu = handler(name);
            if(isNameDu) {
                alert('名称重复！');
                return;
            }
        }


        if(!name || !time || !desc){
            alert('请输入内容！');
            return;
        }

        const isTimeVa = this._timeValidation(time);

        if(!isTimeVa){
            alert('请输入有效日期!');
            return;
        }

        return{
            name,
            time,
            description:desc,
            isDone:false,
            taskName:taskname  
        };
    }

    _timeValidation(time){
        const [year,month,day] = time.split('-');
        if(!year || !month || !day) return false;
        if(year.length !== 4 || year.slice(0,2) !== '20') return false;
        if( +month > 12 || +month < 1) return false;
        if( +day >31 || +day < 1) return false;
        return true;
    }

    _generateMarkup(data,input,clear){
        // console.log(data.isDone);
        if(clear) return'';
        if(input) return`
        <div class="editor--input">
            <div class="editor__header">
                <input class="editor__title" type="text" maxlength="10" placeholder="to-do x">
                <div class="icon-group">
                    <div>
                        <svg class="icon icon--done">
                            <use xlink:href="${icons}#完成"></use>
                        </svg>
                    </div>
                    <div>
                        </svg><svg class="icon icon--edit">
                            <use xlink:href="${icons}#编辑"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="editor__date">
                <label class="editor__date-label" for="start-date">任务日期：</label>
                <input class="editor__date-input" type="text" name="start-date" id="start-date"
                placeholder="yyyy-mm-dd">
            </div>
            <div class="editor__description">
                <textarea class="editor__description-detail" maxlength="200">读完课程</textarea>
            </div>
        </div>
        `;
        return`
        <div class="editor--show">
            <div class="editor__header">
                <span class="editor__title">${data.name}</span>
                <div class="icon-group">
                    <div>
                        <svg class="icon icon--done ${data.isDone ? 'hidden':'' }">
                            <use xlink:href="${icons}#完成"></use>
                        </svg>
                    </div>
                    <div>
                        </svg><svg class="icon icon--edit ${data.isDone ? 'hidden':''}">
                            <use xlink:href="${icons}#编辑"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="editor__date">
                <label class="editor__date-label" for="start-date">任务日期：</label>
                <span class="editor__date-input">${data.time}</span>
            </div>
            <div class="editor__description">
                <div class="editor__description-detail">${data.description}</div>
            </div>
        </div>
        `;
    }
}

export default new EditorView();