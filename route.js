export class Route{
    constructor(component, path , handler , src , childs){
        this.component = component;
        this.path = path;
        this.handler = handler;
        this.src = src;
        this.routes = [];
        if(childs){
            for (let i = 0; i < childs.length; i++) {
                var el = childs[i];
                this.routes.push(new Route(el.component , el.path , el.handle , el.src , el.routes))
            }
        }
    }

    get src(){
        return this._src;
    }

    set src(s){
        this._src = s;
    }

    get routes(){
        return this._routes;
    }

    set routes(c){
        this._routes = c;
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


