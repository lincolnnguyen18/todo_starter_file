'use strict'
export default class ToDoListItem {
    constructor(initId) {
        this.id = initId;
        this.description = `Unknown ${initId}`;
        this.dueDate = new Date().toUTCString();
        this.status = "incomplete";
        this.index = null;
        this.visible = true;
    }
}