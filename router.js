import {Route} from './route';

var GetMode = function(a) {
    if(location.protocol == "file:"){
        return('hash');
    }else if(location.protocol !== "file:" && a == undefined){
        return('history');
    }else if (a && window.history.pushState){
        return(a)
    }
},
GetRoot = function(a) {
    return(a ? a : (location.protocol !== "file:")  ? location.origin : location.href);   
},
CreateNow = function(a) {
  return(a == 'history'?location.pathname:location.hash);  
},
ex = {
    name:'',
    mode:GetMode('history'),
    routes:[],
    root:GetRoot(),
    play:null,
    now:{
      origin:location.origin,
      parm:CreateNow('history'),
    },
},
handelChange = function($el , Manage , id , node , ComponentName , ComponentId){
    $el.innerHTML = null;
    Manage($el , ex.now.target.component , id , node.props , ComponentName , ComponentId)
},
observeObject = function(data, key, val) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function() {
            return val;
        },
        set: function(newVal) {
            if (val === newVal) {return;}
            if(key == 'mode'){
                val = GetMode(newVal);
            }else if(key == 'play'){
                typeof ex.watch == 'function' && ex.watch(handelChange);
            }else{
                val = newVal;
            }
        },
    });
},
init = function init(a) {
    for (const key in a) {
        observeObject(ex, key, a[key]);
    }
},
WatchComponent = function(){
    var match , got    =  ex.now.parm.split('/').filter((item) => item != '' && item !== '#');
    for (let j = 0; j < ex.routes.length; j++) {
        var el     =  ex.routes[j],
            path   =  el._path,
            syntax =  path.split('/').filter((item) => item != ''),
            match  =  {
                index:0,
                match:false
            };        
            if(got.length > syntax.length || got.length < syntax.length){
            }else{
                for (var i = 0; i < got.length; i++) {
                    var x  =  got[i],
                        y  =  syntax[i];
                    if(y[0] !== ':'){//no problem avoiding changing particals  
                        if(x == y){
                            match.index = j;
                            match.match = true;
                        }else{
                            match.index = 0;
                            match.match = false;
                        }
                    }
                }
            }
            if(match.match){
                ex.now.target = (ex.routes[match.index])
                return;
            }
    }
    ex.now.target = ex.routes['*'];
},
Check = function Check() {
    var def = ex.routes[0],
        now = CreateNow(ex.mode);
    if(now == '/' || now == ''){
        go(def._path)
    }
    WatchComponent();
},
locate = function(route){
    ex.now.parm = route;
    WatchComponent();
    ex.play = 'Nirikshan Bhusal';
    if(ex.mode === 'history'){
        window.history.pushState(null , null , ex.root + route);
    }else{
        route = route.replace(/^\//,'');
        window.location.href = window.location.href.replace(/#(.*)$/,'') + '#/' + route;
    }
},
go = function(route){
    match((route ? route : ''));
},
match = function(route){
    for (let i = 0; i < ex.routes.length; i++) {
        let paramNames = [];
        let regexPath = ex.routes[i].path.replace(/([:*])(\w+)/g , function(full , colon , component) {
            paramNames.push(component);
            return('([^\/]+)');
        }) + '(?:\/|$)';
        let routrMatch = route.match(new RegExp(regexPath));
        if(routrMatch !== null){
             var parms = routrMatch.slice( 1 , routrMatch.length).reduce((parms , value , index)=>{
                if(parms === null) parms = {};
                parms[paramNames[index]] = value;
                return parms;
             } , null);
             if(parms == null){
                ex.routes[i].handler();
             }else{
                ex.routes[i].handler(parms);
             }
             locate(route)
        }
    }
},
Router = function Router(a , b) {
        ex.name = a;
        ex.mode = GetMode(b.mode);
        b.route.map(el => { this.add(el)});
        ex.root = GetRoot(b.root);
        ex.now  = {
             origin:location.origin,
             parm:CreateNow(ex.mode),
        };  
        init(ex);
        Check();
        return ex;
};
Router.prototype.add = function(route){
    if(route.path == '404'){
        return ex.routes['*'] = new Route(route.component , route.path , route.handle);
    }
    ex.routes.push(new Route(route.component , route.path , route.handle));
}
window.addEventListener('popstate', function (e) {
    ex.now.parm = CreateNow(ex.mode);
    Check()
    ex.play = 'Nirikshan Bhusal';
}); 
export {
    Router,
    go
}