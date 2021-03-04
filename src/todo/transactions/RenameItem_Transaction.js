import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToRename, newName) {
        super();
        this.model = initModel;
        this.itemRenamed = itemToRename;
        this.newName = newName;
        this.oldName = null;
    }
    doTransaction() {
        if (this.oldName == null)
            this.oldName = this.itemRenamed.description;
        this.model.currentList.items[this.itemRenamed.index].description = this.newName;
        this.model.view.viewCurrentList();
        this.model.view.scrollItemIntoView(this.itemRenamed);
    }
    undoTransaction() {
        this.model.currentList.items[this.itemRenamed.index].description = this.oldName;
        this.model.view.viewCurrentList();
        this.model.view.scrollItemIntoView(this.itemRenamed);
    }
}