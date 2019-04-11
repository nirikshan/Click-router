# Click-router
Dynamic router for click.js based application

Example:- 

```
import {$_Click , app }from 'click-cli';
import { Router } from '../click-router/router.js';

const router = new Router('router',{
    root:'http://localhost:8008',
    mode:'history',
    route:[
        {
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
         <c-top/>
    </div>`),

    state:{
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
