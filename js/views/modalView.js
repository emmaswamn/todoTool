class ModalView{
    _confirmDeleteDialog = document.querySelector('.confirm--delete');
    _confirmEditDialog = document.querySelector('.confirm--edit');
    _confirmAddDialog = document.querySelector('.confirm--add');
    _confirmDoneDialog = document.querySelector('.confirm--done');
    _overlay =document.querySelector('.overlay'); 
    _deletebtn = null;

    showDialog(type,btn=null){
        if(type === 'delete') this._confirmDeleteDialog.classList.remove('hidden');
        if(type === 'edit') this._confirmEditDialog.classList.remove('hidden');
        if(type === 'add') this._confirmAddDialog.classList.remove('hidden');
        if(type === 'done') this._confirmDoneDialog.classList.remove('hidden');
        this._overlay.classList.remove('hidden');
        this._deletebtn = btn;
    }

    closeDialog(type){
        if(type === 'delete') this._confirmDeleteDialog.classList.add('hidden');
        if(type === 'edit') this._confirmEditDialog.classList.add('hidden');
        if(type === 'add') this._confirmAddDialog.classList.add('hidden');
        if(type === 'done') this._confirmDoneDialog.classList.add('hidden');
        this._overlay.classList.add('hidden');
    }
    
    confirmDeleteHandler(handler){
        this._confirmDeleteDialog.addEventListener('click',e =>{
            this._closeModal(e,'delete');
            if(e.target.classList.contains('btn--yes')){
                if(this._deletebtn){
                    let folder = this._deletebtn.closest('.folder__title').querySelector('.folder__name');
                    const folderName = folder.textContent.slice(0,-3);
                    // const isMain = this._deletebtn.closest('.folder__secondary') ? false : true;
                    // console.log(isMain);
                    handler(folderName);
                }
            }
        })
    }

    confirmDoneHandler(handler){
        this._confirmDoneDialog.addEventListener('click',e =>{
            this._closeModal(e,'done');
            if(e.target.classList.contains('btn--yes')){
                const activeTodo = document.querySelector('.todo__item--clicked').textContent;
                handler(activeTodo);
            }
        });
    }

    confirmAddHandler(handler){
        this._confirmAddDialog.addEventListener('click',e =>{
            this._closeModal(e,'add');
            if(e.target.classList.contains('btn--yes')){
                handler();
            }
        });
    }

    confirmEditHandler(handler){
        this._confirmEditDialog.addEventListener('click', e => {
            this._closeModal(e,'edit');
            if(e.target.classList.contains('btn--yes')){
                handler();
            }
        });
    }

    _closeModal(e,type){
        if(!e.target.classList.contains('btn--confirm') && !e.target.classList.contains('close-modal')) return;
        if(e.target.classList.contains('close-modal') || e.target.classList.contains('btn--no') ) {
            // this._confirmDeleteDialog.classList.add('hidden');
            // this._overlay.classList.add('hidden');
            this.closeDialog(type);
            return;
        }
    }

}

export default new ModalView();