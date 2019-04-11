export class Route{
    constructor(component, path , handler){
        this.component = component;
        this.path = path;
        this.handler = handler;
    }

    get component(){
        return this._component;
    }

    set component(component){
        this._component = component;
    }

    get path(){
        return this._path;
    }

    set path(path){
        this._path = path;
    }

    get handler(){
        return this._handler;
    }

    set handler(val){
        this._handler = val;
    }
}