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
	mirrorChildsEvents,
    utils: {
		groupValues: function(gridStyleRows, gridStyleCols) {
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
    	showCoordinates: function(element, groupValues) {
    		element.innerHTML = !groupValues ? `<p>r: ${transferShape.row}</p> <p>c: ${transferShape.column}</p>` : 
    		`<p>r: ${Math.max(...groupValues.rows) - Math.min(...groupValues.rows)}</p> <p>c: ${Math.max(...groupValues.columns) - Math.min(...groupValues.columns)}</p>`;
    	},
    	applyGridStyles: function(element, option, optionContent) {
    		if (option === "transfer") {
    			element.style.gridRow = `${optionContent[0]}/${transferShape.row + optionContent[0]}`;
    			element.style.gridColumn = `${optionContent[1]}/${transferShape.column + optionContent[1]}`;
    		} else if (option === "groupValues") {
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
