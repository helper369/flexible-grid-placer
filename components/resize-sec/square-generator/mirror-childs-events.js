let yAxisChord, xAxisChord, idNum, gridRow, gridColumn, ctrlColumn, ctrlRow, ctrlKeydown, childsHover;
//SHARED-----------------------------------------------------------------------------------------------------------------
function refreshChords(child) {
	//process
	const obteinId = child => parseInt(child.classList[0].slice(1))
	const refreshCoordinates = childId =>{		
  		yAxisChord = Math.floor(childId / this.nColumns() + 0.99)
  		xAxisChord = childId - (this.nColumns() * (yAxisChord - 1))}
	const refreshGridStyles = () => {		
  		gridColumn = `${xAxisChord}/${xAxisChord + 1}`
		gridRow = `${yAxisChord}/${yAxisChord + 1}`}
	//Steps
	const childId = obteinId(child)

	refreshCoordinates(childId)

	refreshGridStyles()
}

function generateShadowShape() {
	//Process
	const removeLastShadowShape = () => this.utils.removeElement("#last-shadow")
	const createElement = () => document.createElement("div")
	const addId = shadowShape => shadowShape.id = "last-shadow";
	const addStyles = shadowShape => {
		const groupedValues = this.utils.groupValues([ctrlRow, gridRow], [ctrlColumn, gridColumn])
		this.utils.applyGridStyles(shadowShape, "groupValues", groupedValues)
		this.utils.showCoordinates(shadowShape, groupedValues)
	}
	const showElement = shadowShape => this.mirrorElement.appendChild(shadowShape)
	//Steps
	removeLastShadowShape()

	const shadowShape = createElement()

	addId(shadowShape)

   	addStyles(shadowShape)

    showElement(shadowShape)
}
//CLICK-----------------------------------------------------------------------------------------------------------------
function transferShapeToFlexibleGrid() {
	let conflictFlag;
	let newCells = [];
	const saveNewCells = () => {
		for (let i = 0; i < transferShape.row; i++) {
			for (let k = 0; k < transferShape.column; k++) {	
				newCells.push([i + yAxisChord, k + xAxisChord]);
			}
	    }}
	const checkCellsConflicts = () => {		
		for (const newCell of newCells) {
			if (conflictFlag) {
				break;
		    } else {
		        for (const savedCell of this.savedCells) {
					if (JSON.stringify(newCell) === JSON.stringify(savedCell)) {
						conflictFlag = true;
		                break;
					}
		        }
		    }
		}}
	const saveCellsInSavedCells = () => newCells.forEach(newCell => {this.savedCells.push(newCell)})
	const configNewMaxValues = () => {		
 		this.setMax(transferShape.row + yAxisChord, true);
 		this.setMax(transferShape.column + xAxisChord, false);}
 	const displayError = () => {
		document.getElementById("last-preview").style.outline = "2px solid red";
		document.getElementById("last-preview").style.color = "red";}
	const createShape = () => document.createElement('div')
	const addClass = shape => shape.classList.add("element-shape")
	const addStyles = shape => {
	 	this.utils.applyGridStyles(shape, "transfer", [yAxisChord, xAxisChord])
	 	this.utils.showCoordinates(shape)}
	const removeLastPreview = () => this.utils.removeElement("#last-preview")
	const launch = shape => this.element.appendChild(shape)

 	saveNewCells()

 	checkCellsConflicts()

	if (conflictFlag) {
		displayError()
		return
	}

	saveCellsInSavedCells()

	configNewMaxValues()
 	
 	let shape = createShape()

 	addClass(shape)

 	addStyles(shape)

 	removeLastPreview()

 	launch(shape)

 	transferShape.flag = false;
}

function clickEvents(child, fc) {
	refreshChords.call(this, child)
	//Build shape in figures-creator
	if (fc) {
		this.figuresBuilder(gridRow, gridColumn);
	}
	//Transfer shape to flexible grid
	else if (transferShape.flag) {
		transferShapeToFlexibleGrid.call(this)
     }
}
//HOVER--------------------------------------------------------------------------------------------------------------------------------
function previewShapeInFlexibleGrid() {
	const removeLastPreview = () => this.utils.removeElement("#last-preview")
	const createPreview = () => document.createElement('div')
	const addId = previewShape => previewShape.id = "last-preview"
	const addStyles = previewShape => {
		this.utils.applyGridStyles(previewShape, "transfer", [yAxisChord, xAxisChord])
	    this.utils.showCoordinates(previewShape)}
	const launch = previewShape => this.mirrorElement.appendChild(previewShape) 

	removeLastPreview()

	let previewShape = createPreview()

	addId(previewShape)

	addStyles(previewShape)

    launch(previewShape)
}
function previewShapeInFiguresCreator() {
	this.figuresBuilder(gridRow, gridColumn, true)
}
function hoverEvents(child, fc) {
	refreshChords.call(this, child);
	if (fc) {
		previewShapeInFiguresCreator.call(this)
	}
	else if (transferShape.flag) {
		previewShapeInFlexibleGrid.call(this)
	}
	else if(ctrlKeydown) {
		generateShadowShape.call(this)}
	else if (!ctrlKeydown) {
		//Choords checkpoint
		ctrlRow = gridRow
		ctrlColumn = gridColumn}
}
//KEYDOWN----------------------------------------------------------------------------------------------------------------------------
function keydownEvents(figuresCreator) {
	const controlDown = event => {
		if (event.key === "Control") {
			if (!ctrlKeydown && !transferShape.flag && childsHover) {
				generateShadowShape.call(this)
			}
			ctrlKeydown = true;
		}}
	const controlUp = event => {
		if (event.key === "Control") {
			ctrlRow = gridRow;
			ctrlColumn = gridColumn;
			this.utils.removeElement("#last-shadow");
			ctrlKeydown = false;
		}}
	if (!figuresCreator) {
		document.addEventListener('keydown', (event)=>{controlDown(event)})
		document.addEventListener('keyup', (event)=>{controlUp(event)})}
}
//============================================================================================================================
function mirrorChildsEvents(figuresCreator) {
	let childs = document.querySelectorAll(`.${!figuresCreator ? "flexible-grid" : "figures-creator"}--mirror > div`);
	childs.forEach((child)=>{
		//Click Events
		child.addEventListener('click', ()=>{
			clickEvents.call(this, child, figuresCreator)
		});
		//Hover Events
		child.addEventListener('mouseover', ()=>{
			hoverEvents.call(this, child, figuresCreator)
			if (!figuresCreator) {childsHover = true}
		});
		child.addEventListener('mouseout', ()=>{
			if (!figuresCreator) {childsHover = false}
		});
	})
	keydownEvents.call(this, figuresCreator)
}