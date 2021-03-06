import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class ChangeDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToChangeDate, newDate) {
        super();
        this.model = initModel;
        this.itemWithDateChanged = itemToChangeDate;
        this.newDate = newDate;
        this.oldDate = null;
    }
    doTransaction() {
        if (this.oldDate == null)
            this.oldDate = this.itemWithDateChanged.dueDate;
        this.itemWithDateChanged.dueDate = this.newDate;
        this.model.view.viewCurrentList();
        this.model.view.scrollItemIntoView(this.itemWithDateChanged);
        this.model.view.highlightItemTemporarily(this.itemWithDateChanged);
    }
    undoTransaction() {
        this.itemWithDateChanged.dueDate = this.oldDate;
        this.model.view.viewCurrentList();
        this.model.view.scrollItemIntoView(this.itemWithDateChanged);
        this.model.view.highlightItemTemporarily(this.itemWithDateChanged);
    }
}