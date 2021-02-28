'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmouseup = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmouseup = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmouseup = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmouseup = function() {
            // appModel.removeCurrentList();
            document.getElementById("modal_container").classList.add('show');
            console.log("open clicked!");
        }
        document.getElementById("add-item-button").onmouseup = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("modal-cancel1").onmouseup = function() {
            modal_container.classList.remove('show');
            console.log("close clicked!");
        }
        document.getElementById("modal-cancel2").onmouseup = function() {
            modal_container.classList.remove('show');
            console.log("close clicked!");
        }
        document.getElementById("modal-confirm").onmouseup  = function() {
            appModel.removeCurrentList();
            modal_container.classList.remove('show');
            console.log("list deleted!");
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }
}