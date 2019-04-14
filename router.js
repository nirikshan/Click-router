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
    RoutsBag:[],
    now:{
      origin:location.origin,
      parm:CreateNow('history'),
    },
},
CombineAllRouts = function(route , currentPath , CombinePathA) {
    var chilldRouts = route.routes;
    for (let j = 0; j < chilldRouts.length; j++) {
        const el    =  chilldRouts[j];
        var   p     =  CombinePathA.concat(el.path.split('/').filter((item) => item != '' && item !== '#'));      
              el['i'] = p;
              ex.RoutsBag.push(el);
        if(el.routes.length > 0){
          CombineAllRouts( el , currentPath , p);
        }
    }
},
InterNamCompare = function(route , root , got , syntax , parmeter ) {
    for (var i = 0; i < got.length; i++) {
        var x  =  got[i],
            y  =  syntax[i];
        if(y[0] !== ':'){//no problem avoiding changing particals and comparing
            if(x == y){
                root.match = true;
                root.item = route
                root.path = got;
            }else{
                 root.match = false;
                 root.item = null;
                 root.path = null;
                 return root;
            }
        }else{
            parmeter[y.substr(1)] = x;    
        }
    }  
    return root;
},
FindTargetChild = function(all , callback) {
    var CurrentPath = ex.CurrentUrl.split('/').filter((item) => item != '' && item !== '#'),
        count = 0;
    for (let j = 0; j < all.length; j++) {
        const el    =  all[j],
              p     =  el.i,
              root  = {
                match:false
            },
            parameters = {};
        if(p.length === CurrentPath.length){
            if(p.toString() == CurrentPath.toString()){
                return callback(el , parameters)
            }else if(p.toString().indexOf(':') !== -1){
                    var result = InterNamCompare(el , root , CurrentPath , p , parameters);
                    if(result.match){
                        return callback(result.item ,  parameters)
                    }
            }
        }else if(CurrentPath.length < p.length){
            if(CurrentPath.length <= 0 || ex.CurrentUrl == '/' || ex.CurrentUrl == ''){
                return callback(ex.RoutsBag[0] , parameters)
            }
        }
        count = j;
    }
    if(all.length == (count + 1)){
       return callback(ex.routes['*'] , {})
    }
},
WatchComponent = function(ax){
  FindTargetChild(ex.RoutsBag  , function(a , b) {
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
    typeof ex.now.target.handler == 'function' && ex.now.target.handler.bind(ex.now.parmeter)();
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
        b.routes.map(el => { this.add(el)});
        CombineAllRouts(ex , {} , []);   
        ex.root = GetRoot(b.root);
        ex.now  = {
             origin:location.origin
        };
        UrlChange();
        return ex;
};
Router.prototype.add = function(route){
    if(route.path == '404'){
        return ex.routes['*'] = new Route(route.component , route.path , route.handle , route.src , route.routes);
    }
    ex.routes.push(new Route(route.component , route.path , route.handle , route.src , route.routes));
}
window.addEventListener('popstate', function (e) {
    ex.CurrentUrl = CreateNow(ex.mode);
}); 
export {
    Router,
    go
}
