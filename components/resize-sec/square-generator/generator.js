let flexDOM = defineDOM();
let transferShape = {
	flag: false,
	row: "",
	column: ""
}
let flexGrid = {
	cellsSize: 50,
	element: document.querySelector(".flexible-grid"),
	mirrorElement: document.querySelector(".flexible-grid--mirror"),
	maxRow: 0,
    maxCol: 0,
	nColumns: function() {
		return Math.floor(this.element.offsetWidth / this.cellsSize)
	},
	nRows: function() {
		return Math.floor(this.element.offsetHeight / this.cellsSize)
	},
    calcMinSize: function() {
     	let minWidth = this.maxCol != 0 ? (this.maxCol - 1) * this.cellsSize : 0;
     	let minHeight = this.maxRow != 0 ? (this.maxRow - 1) * this.cellsSize : 0;
     	this.element.style.minWidth = minWidth + "px";
     	this.element.style.minHeight = minHeight + "px";
     	this.mirrorElement.style.minWidth = minWidth + "px";
     	this.mirrorElement.style.minHeight = minHeight + "px";
    },
    setMax: function(value, row) {
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
		let fragment = document.createDocumentFragment();
		//generate divs
		for (let i = 0; i < this.nColumns() * this.nRows(); i ++) {
			let div = document.createElement("div");
			div.classList.add(`n${i + 1}`, `${!fc ? "cell" : "fc-cell"}`);
			fragment.appendChild(div);
		}
		return fragment
	},
	gridGenerator: function(fc) {
		//mirror
		this.mirrorElement.style.gridTemplateColumns = `repeat(${this.nColumns()}, 1fr)`;
		this.mirrorElement.style.gridTemplateRows = `repeat(${this.nRows()}, 1fr)`;
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
		//main
		this.element.style.gridTemplateColumns = `repeat(${this.nColumns()}, 1fr)`;
		this.element.style.gridTemplateRows = `repeat(${this.nRows()}, 1fr)`;
	},
	mirrorChildsEvents: function (fc) {
		let childs = document.querySelectorAll(`.${!fc ? "flexible-grid" : "figures-creator"}--mirror > div`);
		let yAxisChord, xAxisChord, idNum, gridRow, gridColumn;
		let updateChords = (child) => {
			//Obtein ID
    		idNum = parseInt(child.classList[0].slice(1));
    		//Coordinates of the clicked element
    		yAxisChord = Math.floor(idNum / this.nColumns() + 0.99);
    		xAxisChord = idNum - (this.nColumns() * (yAxisChord - 1));
    		if (fc) {	
    			gridColumn = `${xAxisChord}/${xAxisChord + 1}`;
				gridRow = `${yAxisChord}/${yAxisChord + 1}`;
    		}
		}
		childs.forEach((child)=>{
			child.addEventListener('click', ()=>{
				updateChords(child);
				if (!fc && transferShape.flag) {
					//Generate Shape Element
	        		let shape = document.createElement('div');
	        		//Element Size
	        		let maxRow = transferShape.row + yAxisChord;
	        		let maxColumn = transferShape.column + xAxisChord;
	        		this.setMax(maxRow, true);
	        		this.setMax(maxColumn, false);
	        		shape.style.gridRow = `${yAxisChord}/${maxRow}`;
	        		shape.style.gridColumn = `${xAxisChord}/${maxColumn}`;
	        		//Displays element
	        		shape.style.background = "lightblue";
	        		this.element.appendChild(shape);
	        		document.getElementById("last-shadow").style.outline = "none";
	        		transferShape.flag = false;
				}
				else if (fc) {
                	//Calls the shapes builder
                	this.figuresBuilder(gridRow, gridColumn);
				}
			})
		})
		childs.forEach((child)=>{
			child.addEventListener('mouseover', ()=>{
				updateChords(child);
				if (!fc && transferShape.flag) {
					let lastShadow = document.getElementById("last-shadow");
					if (lastShadow) {
						lastShadow.remove();
					}
					let shadowShape = document.createElement('div');

					shadowShape.id = "last-shadow";

					shadowShape.style.gridRow = `${yAxisChord}/${transferShape.row + yAxisChord}`;
	        		shadowShape.style.gridColumn = `${xAxisChord}/${transferShape.column + xAxisChord}`;

	        		shadowShape.style.outline = "2px solid aqua";
	        		shadowShape.style.backgroundColor = "transparent";
	        		this.element.appendChild(shadowShape);

				} else if (fc) {	
					this.figuresBuilder(gridRow, gridColumn, true);
				}
			})
		})
	},
	update: function(fc) {
		if (!fc) {
			//Process
			this.gridGenerator()
			this.mirrorChildsEvents()
			this.calcMinSize()
			//Reset styles
			this.mirrorElement.style.display = "grid";
			this.element.style.opacity = "1";
		} else {
			this.gridGenerator(fc)
			this.mirrorChildsEvents(fc)
		}
	}
};
let resizeTimer; //This timer is for optimization
const resizeFlexGridObserver = new ResizeObserver(entries => {
    clearTimeout(resizeTimer);
    //Takes off styles while resizing
    flexGrid.mirrorElement.style.display = "none";
    flexGrid.element.style.opacity = "0";
    resizeTimer = setTimeout(() => {
    	flexGrid.update();
    }, 50);
});
resizeFlexGridObserver.observe(flexGrid.element);
