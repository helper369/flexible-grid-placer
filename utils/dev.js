//DOM Manipulation
function createDOM(objeto, all, ...elementos) {
  elementos.forEach(elemento => {
    if (all) {
      objeto[elemento] = document.querySelectorAll(elemento);
    } else {
      objeto[elemento] = document.querySelector(elemento);
    }
  });
}
function createProxyDOM(objeto) {
  const handleNonExistenceDOM = {
    get: function(target, prop) {
          if (!(prop in target)) {
            let elementProp = document.querySelectorAll(prop);
            if (elementProp.length !== 0) {
              //console.log("New Element/s Found: " + prop);
                createDOM(
                  objeto,
                  elementProp.length !== 1,
                  prop
                )
                return objeto[prop];
            } else {
              console.error("Element/s not found: " + prop)
              return undefined
            }
          }
          return target[prop];
      }
  }
  return new Proxy(objeto, handleNonExistenceDOM);
}
function defineDOM() {
  let objeto = {};
  objeto = createProxyDOM(objeto);
  return objeto 
}

function applyResizeEvent(resizeElementParam, elementParam, startActions, resizeActions, stopActions, options = {}) {
  //Manejo de elementos redimensionables
  let obj = options;
  //Required Variables
  obj.resizeElement = document.querySelector(resizeElementParam);
  obj.resizeElement.addEventListener('mousedown', startResize);
  obj.element = document.querySelector(elementParam);
  let isResizing = false;
  //Could change between x and y or both
  obj.startPositionX = 0;
  obj.startPositionY = 0; 
  //Could change between height and width or both
  obj.originalSizeWidth = 0;
  obj.originalSizeHeight = 0;
  
  //============================================================================================================================================================================
  //Called Asociated to the element navbar
  function startResize() {
    //events only existing in the call of startResize until the end
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    isResizing = true;
    obj.startPositionX = event.clientX;
    obj.startPositionY = event.clientY;
    obj.originalSizeWidth = obj.element.offsetWidth;
    obj.originalSizeHeight = obj.element.offsetHeight;
    startActions(obj);
    document.body.style.userSelect = 'none';
  }
  //============================================================================================================================================================================
  function resize() {
    if (isResizing) {
      //Size of element being applied the event
      //event.clientX Aumenta cuando va hacia la derecha
      //event.clientY Aumenta cuando va hacia abajo
      resizeActions(obj);
    }
  }
  //============================================================================================================================================================================
  function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    isResizing = false;
    obj.originalSizeWidth = obj.element.offsetWidth;
    obj.originalSizeHeight = obj.element.offsetHeight;
    stopActions(obj);
    document.body.style.userSelect = '';
  }
  //console.log(JSON.stringify(obj));
}
console.log('DEPENDENCY "SHARED" CONNECTED');