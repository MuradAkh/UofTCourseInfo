function onElementHeightChange(elm, callback){
  let lastHeight = elm.clientHeight, newHeight;
  (function run(){
    newHeight = elm.clientHeight;
    if( lastHeight !== newHeight )
      callback();
    lastHeight = newHeight;

    if( elm.onElementHeightChangeTimer )
      clearTimeout(elm.onElementHeightChangeTimer);

    elm.onElementHeightChangeTimer = setTimeout(run, 5000);
  })();
}

onElementHeightChange(document.body, () => {
  findCourses();
  generateTooltips();
});