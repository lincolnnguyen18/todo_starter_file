import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class MoveItemDown_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToMove) {
        super();
        this.model = initModel;
        this.itemMoved = itemToMove;
    }
    doTransaction() {
        let model = this.model;
        let currentList = model.currentList.items;
        let itemMovedIndex = this.itemMoved.index;
        let itemMoved = currentList[itemMovedIndex];
        let itemBelowItemMoved = currentList[itemMovedIndex + 1];
        model.switchTwoItemsInCurrentList(itemMoved, itemBelowItemMoved);
        model.view.viewCurrentList();
    }
    undoTransaction() {
        this.doTransaction();
    }
}