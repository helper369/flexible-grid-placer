//The value of the element might change in future

let lever = document.querySelector("#lever");
lever.addEventListener('input', ()=>{
	flexGrid.cellsSize = lever.value;
	flexGrid.update();
});