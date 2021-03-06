export default class ToDoListItem {
    constructor(initId) {
        this.id = initId;
        this.description = `Unknown ${initId}`;
        this.dueDate = new Date();
        this.status = "incomplete";
        this.index = null;
        this.visible = true;
    }
}