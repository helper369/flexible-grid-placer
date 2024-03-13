let flexDOM = defineDOM();
//Transfer shape from figures creator to flexible-grid
let transferShape = {
	flag: false,
	row: "",
	column: ""
} //flexible-grid
let flexGrid = {
	cellsSize: 50,
	element: document.querySelector(".flexible-grid"),
	mirrorElement: document.querySelector(".flexible-grid--mirror"),
	maxRow: 0,
    maxCol: 0,
    minSize: "auto",
    savedCells: [],
    utils: {
		splitter: function(gridStyleRows, gridStyleCols) {
	    	let splitAndParse = (gridStyles) => {
	    		let result = [];
	    		gridStyles.forEach(gridStyle=>{
	    			let splitted = gridStyle.split("/");
	    			let parsed = [parseInt(splitted[0]), parseInt(splitted[1])]

	    			result = result.concat(parsed);
	    		})
	    		return result
	    	}	

	        return {rows: splitAndParse(gridStyleRows), columns: splitAndParse(gridStyleCols)};
    	},
    	removeElement: function(elementParam) {
    		let element = document.querySelector(elementParam);
    		if (element) {
    			element.remove();
    		}
    	},
    	showCoordinates: function(element, splitter) {
    		element.innerHTML = !splitter ? `<p>r: ${transferShape.row}</p> <p>c: ${transferShape.column}</p>` : 
    		`<p>r: ${Math.max(...splitter.rows) - Math.min(...splitter.rows)}</p> <p>c: ${Math.max(...splitter.columns) - Math.min(...splitter.columns)}</p>`;
    	},
    	applyGridStyles: function(element, option, optionContent) {
    		if (option === "transfer") {
    			element.style.gridRow = `${optionContent[0]}/${transferShape.row + optionContent[0]}`;
    			element.style.gridColumn = `${optionContent[1]}/${transferShape.column + optionContent[1]}`;
    		} else if (option === "splitter") {
    			element.style.gridRow = `${Math.min(...optionContent.rows)}/${Math.max(...optionContent.rows)}`;
    			element.style.gridColumn = `${Math.min(...optionContent.columns)}/${Math.max(...optionContent.columns)}`;
    		} else if (option === "alternative") {
    			element.style.gridRow = `${optionContent[0]}`;
    			element.style.gridColumn = `${optionContent[1]}`;
    		}
    	}
    },
	nColumns: function() {
		return Math.floor(this.element.offsetWidth / this.cellsSize)
	},
	nRows: function() {
		return Math.floor(this.element.offsetHeight / this.cellsSize)
	},
    calcMinSize: function() {
    	let auto = this.minSize === "auto" ? true : false;
    	let border = this.minSize === "border" ? true : false;
    	let minWidth, minHeight;
    	if (auto) {
     		minWidth = `${this.maxCol != 0 ? (this.maxCol - 1) * this.cellsSize : 0}px`;
     		minHeight = `${this.maxRow != 0 ? (this.maxRow - 1) * this.cellsSize : 0}px`;
    	}
    	else if (border) {
    		minWidth = `${this.maxCol != 0 ? (this.maxCol) * this.cellsSize : 0}px`;
     		minHeight = `${this.maxRow != 0 ? (this.maxRow) * this.cellsSize : 0}px`;
    	} else {
    		console.log("especified by user, anyways, auto will be activated before an error occurs")
    	}
     	this.element.style.minWidth = minWidth;
     	this.element.style.minHeight = minHeight;
     	this.mirrorElement.style.minWidth = minWidth;
     	this.mirrorElement.style.minHeight = minHeight;
    },
    setMax: function(value, row) {
    	//Saves the higher value in row and column flexible grid elements for calculating the minSize of the grid
    	if (row) {
        	if (value > this.maxRow) {
            	this.maxRow = value;
            	this.calcMinSize();
        		}
    		} else {
        		if (value > this.maxCol) {
            	this.maxCol = value;
            	this.calcMinSize();
        	}
    	}
    },
	fragment: function(fc) {
		//Generate event-childs for mirrors
		let fragment = document.createDocumentFragment();
		for (let i = 0; i < this.nColumns() * this.nRows(); i ++) {
			let div = document.createElement("div");
			div.classList.add(`n${i + 1}`, `${!fc ? "cell" : "fc-cell"}`);
			fragment.appendChild(div);
		}
		return fragment
	},
	gridGenerator: function(fc) {
		//generate mirror element grid
		this.mirrorElement.style.gridTemplateColumns = `repeat(${this.nColumns()}, 1fr)`;
		this.mirrorElement.style.gridTemplateRows = `repeat(${this.nRows()}, 1fr)`;
		//Append event-childs for mirror element grids
		if (!fc) {
			this.mirrorElement.innerHTML = ""
			this.mirrorElement.appendChild(this.fragment());
		} else {
			let cells = document.querySelectorAll(".fc-cell");
			if (cells) {
				cells.forEach((cell)=>{
					cell.remove();
				});
				this.mirrorElement.appendChild(this.fragment(true));
			}
		}
		//generate element grid
		this.element.style.gridTemplateColumns = `repeat(${this.nColumns()}, 1fr)`;
		this.element.style.gridTemplateRows = `repeat(${this.nRows()}, 1fr)`;
	},
	mirrorChildsEvents: function (fc) {
		let childs = document.querySelectorAll(`.${!fc ? "flexible-grid" : "figures-creator"}--mirror > div`);
		let yAxisChord, xAxisChord, idNum, gridRow, gridColumn, ctrlColumn, ctrlRow, ctrlKeydown;
		//Update child coordinates and info
		let updateChords = (child) => {
			//Obtein ID
    		idNum = parseInt(child.classList[0].slice(1));
    		//Coordinates of the clicked element
    		yAxisChord = Math.floor(idNum / this.nColumns() + 0.99);
    		xAxisChord = idNum - (this.nColumns() * (yAxisChord - 1));

    		gridColumn = `${xAxisChord}/${xAxisChord + 1}`;
			gridRow = `${yAxisChord}/${yAxisChord + 1}`;
		}
		let generateShadowShape = () => {
			//Groups shadow rows and columns values in arrays
			let splitter = this.utils.splitter([ctrlRow, gridRow], [ctrlColumn, gridColumn]);
			//Removes last shadow
			this.utils.removeElement("#last-shadow");
			//Creates new shadow
			let shadowShape = document.createElement("div");
			shadowShape.id = "last-shadow";
			//Shadow styles
			this.utils.applyGridStyles(shadowShape, "splitter", splitter);
          	this.utils.showCoordinates(shadowShape, splitter)
          	//Show the shadow
          	this.mirrorElement.appendChild(shadowShape);
		}
		childs.forEach((child)=>{
			//Click Events
			child.addEventListener('click', ()=>{
				updateChords(child);
                //Build shape in figures-creator
				if (fc) {
                	this.figuresBuilder(gridRow, gridColumn);
				}
				//Transfer shape to flexible grid
				else if (transferShape.flag) {
	        		let conflictFlag;
	        		let newCells = [];
	        		//Saving space occupied by the shape
        			for (let i = 0; i < transferShape.row; i++) {
        				for (let k = 0; k < transferShape.column; k++) {	
        					newCells.push([i + yAxisChord, k + xAxisChord]);
        				}
        			}
	        		//Check space !conflicts
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
				    }
					if (conflictFlag) {
						document.getElementById("last-preview").style.outline = "2px solid red";
						document.getElementById("last-preview").style.color = "red";
						return
					}
					//Store newCells if there is no conflicts
					newCells.forEach(newCell => {
						this.savedCells.push(newCell);
					})
					//console.log(JSON.stringify(newCells));
	        		let shape = document.createElement('div');
	        		this.setMax(transferShape.row + yAxisChord, true);
	        		this.setMax(transferShape.column + xAxisChord, false);
	        		this.utils.applyGridStyles(shape, "transfer", [yAxisChord, xAxisChord]);
	        		//Displays element
	        		shape.classList.add("element-shape")
	        		this.utils.showCoordinates(shape);
	        		this.element.appendChild(shape);
	        		this.utils.removeElement("#last-preview")
	        		transferShape.flag = false;
				}
			})
			//Hover Events
			child.addEventListener('mouseover', ()=>{
				updateChords(child);
				//Preview for figures-creator
				if (fc) {	
					this.figuresBuilder(gridRow, gridColumn, true);
				}
				//Preview for flexible grid
				else if (transferShape.flag) {
					this.utils.removeElement("#last-preview");
					let previewShape = document.createElement('div');
					previewShape.id = "last-preview";
					this.utils.applyGridStyles(previewShape, "transfer", [yAxisChord, xAxisChord]);
	        		this.utils.showCoordinates(previewShape);
	        		this.mirrorElement.appendChild(previewShape);
				}
				else if(ctrlKeydown) {
					generateShadowShape();
				}
				else if (!ctrlKeydown) {
					ctrlRow = gridRow;
					ctrlColumn = gridColumn;
				}
			})
		})
		if (!fc) {
			document.addEventListener('keydown', (event)=>{
				if (event.key === "Control" && !fc && !transferShape.flag) {
					if (!ctrlKeydown && gridRow) {
						generateShadowShape()
					}
					ctrlKeydown = true;
				}
			})
			document.addEventListener('keyup', (event)=>{
				if (event.key === "Control" && !fc && !transferShape.flag) {
					ctrlRow = gridRow;
					ctrlColumn = gridColumn;
					this.utils.removeElement("#last-shadow");
					ctrlKeydown = false;
				}
			})
		}
	},
	update: function(fc) {
		if (!fc) {
			this.gridGenerator()
			this.mirrorChildsEvents()
			this.calcMinSize()
			//Reset styles (optimization)
			this.mirrorElement.style.display = "grid";
			this.element.style.opacity = "1";
		} else {
			this.gridGenerator(fc)
			this.mirrorChildsEvents(fc)
		}
	}
};
//Updates flexible-grid when father-element resolution changes
let resizeTimer; //This timer is for optimization
const resizeFlexGridObserver = new ResizeObserver(entries => {
    clearTimeout(resizeTimer);
    //Takes off styles while resizing (optimization)
    flexGrid.mirrorElement.style.display = "none";
    flexGrid.element.style.opacity = "0";
    resizeTimer = setTimeout(() => {
    	flexGrid.update();
    }, 50);
});
resizeFlexGridObserver.observe(flexGrid.element);
