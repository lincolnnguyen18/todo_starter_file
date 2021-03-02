export default class ToDoList {
    constructor(initId) {
        this.id = initId;
        this.name = `Unknown ${initId}`;
        this.items = [];
    }   
}