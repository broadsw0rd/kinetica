/*
    __ __ _            __  _         ______            _           
   / //_/(_)___  ___  / /_(_)____   / ____/___  ____ _(_)___  ___  
  / ,<  / / __ \/ _ \/ __/ / ___/  / __/ / __ \/ __ `/ / __ \/ _ \ 
 / /| |/ / / / /  __/ /_/ / /__   / /___/ / / / /_/ / / / / /  __/ 
/_/ |_/_/_/ /_/\___/\__/_/\___/  /_____/_/ /_/\__, /_/_/ /_/\___/  
                                             /____/                 
*/
;(function umd(name, root, factory){
    if (typeof module !== 'undefined' && module.exports) { 
        module.exports = factory() 
    }
    else if (typeof define === 'function' && define.amd) { 
        define(factory) 
    }
    else { 
        root[name] = factory() 
    }
}('Kinetic', Function('return this')(), function factory(){

return function scope(){
