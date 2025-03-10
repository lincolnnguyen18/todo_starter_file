import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class SetIncomplete_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToSet) {
        super();
        this.model = initModel;
        this.itemSet = itemToSet;
        this.newStatus = 'incomplete';
        this.oldStatus = 'complete';
    }
    doTransaction() {
        let model = this.model;
        model.currentList.items[this.itemSet.index].status = this.newStatus;
        model.view.viewCurrentList();
        model.view.scrollItemIntoView(this.itemSet);
        model.view.highlightItemTemporarily(this.itemSet);
    }
    undoTransaction() {
        let model = this.model;
        model.currentList.items[this.itemSet.index].status = this.oldStatus;
        model.view.viewCurrentList();
        model.view.scrollItemIntoView(this.itemSet);
        model.view.highlightItemTemporarily(this.itemSet);
    }
}