/**
 * Created by Boaz on 22/02/2017.
 */
"use strict";
function Folder(id, name, type, content, parentId){
    this._id = id;
    this._name = name;
    this._type = type;
    this._content = content;
    this._parentId = parentId;
    this._children = [];
}

Folder.prototype.rename = function(name){
    this._name = name;
};

Folder.prototype.getType = function(type){
    if (this._type === type){
        return true;
    }
    return false;
};

Folder.prototype.addChild = function(file){
    this._children.push(file);
};

Folder.prototype.deleteChild = function (file) {
    let i = 0;
    while (i < this._children.length){
        if (this._children[i] === file){
            this._children.splice(i, 1);
            break;
        }
        i++;
    }
};