'use strict'
import ToDoModel from './ToDoModel.js'
import ToDoView from './ToDoView.js'
import ToDoController from './ToDoController.js'
export class ToDoTrackerApp {
    constructor() {
        this.model = new ToDoModel();
        this.view = new ToDoView();
        this.controller = new ToDoController();
        this.model.setView(this.view);
        this.view.setController(this.controller);
        this.controller.setModel(this.model);
    }
    launch(testFile) {
        let xmlhttp = new XMLHttpRequest();
        let modelToUpdate = this.model;
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let json = JSON.parse(this.responseText);
                for (let i = 0; i < json.lists.length; i++) {
                    let listToAdd = modelToUpdate.addNewList(json.lists[i].name);
                    for (let j = 0; j < json.lists[i].items.length; j++) {
                        let itemData = json.lists[i].items[j];
                        modelToUpdate.addNewItemToList(listToAdd, itemData.description, itemData.due_date, itemData.status);
                    }
                }
            }
        };
        xmlhttp.open("GET", testFile, true);
        xmlhttp.send();
        this.model.setUndoRedoButtonStates();
        this.model.setAddItemDeleteListCloseListButtonState();
    }
}
window.onload = function() {
    let app = new ToDoTrackerApp();
    app.launch("./src/test/TestToDoLists.json");
}