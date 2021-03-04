import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
        this.itemAdded = null;
    }
    doTransaction() {
        let model = this.model;
        if (this.itemAdded == null) {
            this.itemAdded = model.addNewItem();
        } else {
            let itemInList = model.currentList.items[this.itemAdded.index];
            itemInList.visible = true;
        }
        model.view.viewCurrentList();
        model.view.scrollItemIntoView(this.itemAdded);
    }
    undoTransaction() {
        let model = this.model;
        let itemAboveAddedItem = model.getVisibleItemAboveItem(this.itemAdded);
        let itemInList = model.currentList.items[this.itemAdded.index];
        itemInList.visible = false;
        model.view.viewCurrentList();
        if (itemAboveAddedItem != null)
            model.view.scrollItemIntoView(itemAboveAddedItem);
    }
}