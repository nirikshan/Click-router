export class Route{
    constructor(component, path , handler , src){
        this.component = component;
        this.path = path;
        this.handler = handler;
        this.src = src;
    }

    get src(){
        return this._src;
    }

    set src(s){
        this._src = s;
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
