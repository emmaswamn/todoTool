class UndoView{
    _parentElement = document.querySelector('.folders');

    updateTotalSum(){
        const sumDom = this._parentElement.querySelector('.folders__title');
        const allMainFold = Array.from(this._parentElement.querySelectorAll('.folder__main'));
        const allFoldSum = allMainFold.map(ele => +ele.querySelector('.folder__title').dataset.num)
                            .reduce((pre,cur) => pre + cur);
        sumDom.textContent=`所有任务(${allFoldSum})`;
    } 


}

export default new UndoView();