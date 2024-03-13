let figuresCreatorUnassigned = Object.assign({}, flexGrid);
let figuresCreator = Object.assign({}, figuresCreatorUnassigned, {
    cellsSize: 12,
    element: document.querySelector(".figures-creator"),
    mirrorElement: document.querySelector(".figures-creator--mirror"),
    resetCount: 0,
    stack: [],
    reset: function() {
        if (this.resetCount === 2) {
            this.resetCount = 0;
            this.element.innerHTML = "";
            this.stack = [];
        }
        this.resetCount++;
    },
    figuresBuilder: function(row, column, hover) {
        let shadowStack, columns, rows;
        //Saves the two grid styles (row and column) in the stack array
        if (!hover) {
            //counter
            this.reset();
            this.stack.push({
                'row': row,
                'column': column
            });
        } else {
            shadowStack = this.stack.slice();
            shadowStack.push({
                'row': row,
                'column': column
            })
        }
        //Show the clicked cell in the first step
        if (this.resetCount != 2 && !hover) {
            let div = document.createElement('div');
            div.style.background = "lightblue";
            this.utils.applyGridStyles(div, "alternative", [row, column]);
            this.element.appendChild(div);
        } 
        //Process to make the connections between the two points and transfer
        else if (this.resetCount === 2 && !hover) {
            //Groups rows and columns values in arrays
            let splitter = this.utils.splitter([this.stack[0].row, this.stack[1].row], [this.stack[0].column, this.stack[1].column])
            //Cleans the mirror for entering the new shape
            this.element.innerHTML = "";
            //Transfer the height length
            transferShape.row = Math.max(...splitter.rows) - Math.min(...splitter.rows);
            //Transfer the width length
            transferShape.column = Math.max(...splitter.columns) - Math.min(...splitter.columns);
            //Enable the transferation
            transferShape.flag = true;
        } 
        //Process to show the shape while hovering
        else if(hover && this.resetCount === 1) {
            //Groups shadow rows and columns values in arrays
            let splitter = this.utils.splitter([shadowStack[0].row, shadowStack[1].row], [shadowStack[0].column, shadowStack[1].column])
            //Removes last shadow
            this.utils.removeElement("#last-shadow-fc");
            //Creates new shadow
            let shadowElement = document.createElement("div");
            shadowElement.id = "last-shadow-fc";
            this.utils.applyGridStyles(shadowElement, "splitter", splitter);
            //Shadow rows and columns
            this.utils.showCoordinates(shadowElement, splitter);
            //Show the shadow
            this.element.appendChild(shadowElement);
        }  
    }
})
window.addEventListener('resize', function() {
  figuresCreator.update(true);
});
figuresCreator.update(true);
