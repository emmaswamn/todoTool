import modalView from "./modalView.js";

class RemoveFoldView{
    _parentElement = document.querySelector('.folder__lists');
    _deleteBtn = null;

    showHideDelete(){
        this._parentElement.addEventListener('mouseover',function(e){
            const isMain = e.target.closest('.folder__secondary') || e.target.closest('.folder__main');
            if(!isMain) return;
            this._deleteBtn = isMain.querySelector('.icon--delete');
            this._deleteBtn.classList.remove('hidden');
        });
        this._parentElement.addEventListener('mouseout',function(e){
            const isMain = e.target.closest('.folder__secondary') || e.target.closest('.folder__main');
            if(!isMain) return;
            if(this._deleteBtn) this._deleteBtn.classList.add('hidden');
        });
        this._parentElement.addEventListener('click', function(e){
            const folderName = this._deleteBtn.closest('.folder__title').querySelector('.folder__name');
            if(folderName.textContent.slice(0,-3) === '默认分类') return;
            if(!e.target.closest('.icon--delete')) return;
            if(this._deleteBtn){
               modalView.showDialog('delete',this._deleteBtn);
            }
        })
    }

}

export default new RemoveFoldView();