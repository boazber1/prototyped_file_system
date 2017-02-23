/**
 * Created by Boaz on 22/02/2017.
 */

function Filesystem(name) {
    this._root = new Folder(0, name, 'directory', '', -1);
    this._files = [this._root];
}


Filesystem.prototype.addFolder = function (name, parentId) {//
    let newFile = new Folder(this._files.length, name, 'directory', '', parentId);
    this._files.push(newFile);
    this._files[parentId].addChild(newFile);
};

Filesystem.prototype.addFile = function (name, parentId, content) {//
    var newTextFile = new File(this._files.length, name, 'file', content, parentId);
    this._files.push(newTextFile);
    this._files[parentId].addChild(newTextFile);
}


Filesystem.prototype.deleteItem = function (id) { //HADASH TISTAKEL REKURSIA!
    var fileToDelete = this._files[id];
    var parentFile = this._files[fileToDelete._parentId];
    parentFile.deleteChild(fileToDelete);

    for (var i = 0; i < this._files.length; i++) {
        if (this._files[i]) {
            if (this._files[i]._parentId == fileToDelete._id) {
                this.deleteItem(this._files[i]._id);
            }
        }
    }

    this._files[id] = undefined;
};

Filesystem.prototype.getItem = function (pathOrIdOrUndefind) {//
    return this._files[pathOrIdOrUndefind];
};


Filesystem.prototype.getLastId = function (id) {
    return this._files.length -1;
};

Filesystem.prototype.isFileNameExist = function (fileId, name, type){
    var file = this.getItem(fileId);
    for (var i = 0; i < file._children.length; i++){
        if(file._children[i]._type === type && file._children[i]._name === name){
            return true;
        }
    }
    return false;
};

Filesystem.prototype.getUnduplicatedFileName = function (folderId, name, type){
    var fileName = name;
    var counter = 0;
    var flag = true;

    while (flag){
        if (counter > 0){
            fileName = name + '(' +counter + ')';
        }
        if (!this.isFileNameExist(folderId, fileName, type)){
            flag = false;
        }
        counter++;
    }

    return fileName;
}

Filesystem.prototype.findParent = function (id) {
    var targetFile = this._files[id];
    var parent = this._files[targetFile._parentId];
    return parent;
}

Filesystem.prototype.savingToLocalStorage = function(){
    var saveArray = [];
    for(var i = 0; i < this._files.length; i++){
        if(this._files[i]) {
            saveArray.push([this._files[i]._id, this._files[i]._name, this._files[i]._type,
                this._files[i]._parentId, this._files[i]._content]);
        }
    }
    localStorage.setItem('FileSystem',JSON.stringify(saveArray));
};




