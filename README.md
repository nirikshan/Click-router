# Click-router
Dynamic router for click.js based application

Example:- 

```js
import {$_Click , app }from 'click-cli';
import { Router , go } from 'click-router';

const router = new Router('myrouter',{
    root:'http://localhost:8008', //If not given same Url as current URL
    mode:'history', // If not given history for server and hash for file://
    routes:[
        {
            src:()=>import('./pages/home.js'),
            component:'home' , 
            path:'/home' , 
            handle:(a)=>{ 
                console.log('handle this is home' , a)
            }
        },
        {
            component:'about' , 
            path:'/about' , 
            handle:(b)=>{ 
                console.log('handle this is about' , b)
            }
        },
        {
            src:()=>import('./pages/contact.js'),
            component:'contact' , 
            path:'/contact/:id/:class/map' , 
            handle:(a)=>{ 
                console.log('handle this is contact')
            }
        },
        {
            component:'404' , 
            path:'404' , 
            handle:(a)=>{ 
                console.log('not found !! 404')
            }
        }
    ]
});

new app('parent',{
    view: (`<div>
         <button c-click='home'>home</button>
         <c-myrouter name='{name}'/>
    </div>`),

    state:{
      name:'nirikshan'
    },
    
    fn:{
     home:function(){
       go('/contact/123/abcdclass/map')
     }
    }

})


new $_Click('Xprin' ,{
    el:'#root',
    global: global,
    service:[
       router
    ]
}).render('parent');


```

# Child Routes Example:- 

```js
const router = new Router('router',{
    root:'http://localhost:8008',
    mode:'history',
    routes:[
        {
            src:()=>import('./pages/home.js'),
            component:'home' , 
            path:'/home' ,
            routes:[
                    { 
                    component:'admin' ,
                    path:'/admin' ,
                    routes:[
                        {component:'adminSupp' ,path:'/supplier' ,handle:(b)=>{console.log('home ko ne admin admin' , b)}},
                        {component:'adminMain',path:'/main' ,handle:(b)=>{console.log('home ko ne suppliers admin' , b)}}
                    ],
                    handle:(b)=>{
                        console.log('home ko ne admin' , b)
                    }
                    },
                    {
                        component:'user' ,
                        path:'/user' ,
                        routes:[
                            {component:'userSup' ,path:'/supplier' , handle:(b)=>{ console.log('home ko ne asupplier user' , b)}},
                            {component:'userMain' ,path:'/main' ,handle:(b)=>{console.log('home ko ne user suppliers' , b)}}
                        ],
                        handle:(b)=>{ 
                            console.log('home ko ne suppliers' , b)
                        }
                    }
            ], 
            handle:(a)=>{ 
                console.log('handle this is home' , a)
            }
        },
        {
            component:'about' , 
            path:'/about/:id/:class/map' ,
            routes:[
                {component:'main' , path:'/main' , handle:()=>{console.log('this is main route of about')}},
                {component:'gain' , path:'/gain' , handle:()=>{console.log('this is gain route of about')}}
            ], 
            handle:(b)=>{ 
                console.log('handle this is about' , b)
            }
        },
        {
            src:()=>import('./pages/contact.js'),
            component:'contact' , 
            path:'/contact/:id/:class/map' , 
            handle:function(a){ 
                console.log('handle this is contact' , this , a)
            }
        },
        {
            component:'404' , 
            path:'404' , 
            handle:(a)=>{ 
                console.log('not found !! 404')
            }
        }
    ]
});

```
