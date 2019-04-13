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
    CurrentUrl:CreateNow(GetMode('history')),
    now:{
      origin:location.origin,
      parm:CreateNow('history'),
    },
},
syncComponent = function(callack){
    var match , got    =  ex.CurrentUrl.split('/').filter((item) => item != '' && item !== '#');
    for (let j = 0; j < ex.routes.length; j++) {
        var el     =  ex.routes[j],
            path   =  el._path,
            syntax =  path.split('/').filter((item) => item != ''),
            match  =  {
                index:0,
                match:false
            },
            parmeter = {};        
            if(got.length > syntax.length || got.length < syntax.length){
                if(ex.CurrentUrl == '/' || ex.CurrentUrl == ''){
                    return callack(ex.routes[0] , parmeter);
                }
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
                    }else{
                        parmeter[y.substr(1)] = x;    
                    }
                }
            }
            if(match.match){
                return callack(ex.routes[match.index] , parmeter);
            }
    }
    callack(ex.routes['*'] , parmeter)
},
WatchComponent = function(ax){
  syncComponent(function (a , b) {
     if(a.src && typeof a.src === 'function'){
        a.src().then(o=>{
            ax(a , b); 
            ex.play = '#1'
        })
      }else{
        ax(a , b);
          if(ex.watch == undefined){
            setTimeout(() => { 
                ex.play = '#2'
            }, 30);
          }else{
            ex.play = '#2'
          }
          
      }
  });
},
locate = function(route){
    if(ex.mode === 'history'){
        window.history.pushState(null , null , ex.root + route);
    }else{
        route = route.replace(/^\//,'');
        window.location.href = window.location.href.replace(/#(.*)$/,'') + '#/' + route;
    } 
    
},
UrlChange = function() {
    WatchComponent(function(a , b) {
        ex.now.target = ((ex.CurrentUrl == '/' || ex.CurrentUrl == '') ? ex.routes[0] : a);
        ex.now.parmeter = b;
    })
},
handelChange = function($el , Manage , id , node , ComponentName , ComponentId){
    $el.innerHTML = null;
    Manage($el , ex.now.target.component , id , node.props , ComponentName , ComponentId)
    typeof ex.now.target.handler == 'function' && ex.now.target.handler()
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
            }else if(key == 'CurrentUrl'){
                val = newVal;
                UrlChange(val);
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
go = function(path) {
    ex.CurrentUrl = path;
    if(ex.now.target._path !== '404'){
        locate(path)
    }
},
Router = function Router(a , b) {
        init(ex);
        ex.name = a;
        ex.mode = GetMode(b.mode);
        b.route.map(el => { this.add(el)});
        ex.root = GetRoot(b.root);
        ex.now  = {
             origin:location.origin
        };
        UrlChange();
        return ex;
};
Router.prototype.add = function(route){
    if(route.path == '404'){
        return ex.routes['*'] = new Route(route.component , route.path , route.handle , route.src);
    }
    ex.routes.push(new Route(route.component , route.path , route.handle , route.src));
}
window.addEventListener('popstate', function (e) {
    ex.CurrentUrl = CreateNow(ex.mode);
}); 
export {
    Router,
    go
}
