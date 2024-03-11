let figuresCreatorUnassigned = Object.assign({}, flexGrid);
let figuresCreator = Object.assign({}, figuresCreatorUnassigned, {
    cellsSize: 8,
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
        //Splits grid style values for grouping them then
        function splitter(gridStyle) {
            let splited = gridStyle.split("/");
            return [parseInt(splited[0]), parseInt(splited[1])];
        }
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
            div.style.gridRow = `${row}`;
            div.style.gridColumn = `${column}`;
            this.element.appendChild(div);
        } 
        //Process to make the connections between the two points and transfer
        else if (this.resetCount === 2 && !hover) {
            //Groups rows and columns values in arrays
            columns = splitter(this.stack[0].column).concat(splitter(this.stack[1].column));
            rows = splitter(this.stack[0].row).concat(splitter(this.stack[1].row));
            //Cleans the mirror for entering the new shape
            this.element.innerHTML = "";
            //Creates the shape
            // let div = document.createElement("div");
            // Calculate the sizes and Adds the grid styles
            // div.style.gridRow = `${Math.min(...rows)}/${Math.max(...rows)}`;
            // div.style.gridColumn = `${Math.min(...columns)}/${Math.max(...columns)}`;
            // Shows the result in the figures creator
            // div.style.background = "lightblue";
            // this.element.appendChild(div);
            //Transfer the height length
            transferShape.row = Math.max(...rows) - Math.min(...rows);
            //Transfer the width length
            transferShape.column = Math.max(...columns) - Math.min(...columns);
            //Enable the transferation
            transferShape.flag = true;
        } 
        //Process to show the shape while hovering
        else if(hover && this.resetCount === 1) {
            //Groups shadow rows and columns values in arrays
            columns =  splitter(shadowStack[0].column).concat(splitter(shadowStack[1].column));
            rows = splitter(shadowStack[0].row).concat(splitter(shadowStack[1].row));
            //Removes last shadow
            let shadowElementId = document.getElementById("shadow-element");
            if (shadowElementId) {
                shadowElementId.remove();
            }
            //Creates new shadow
            let shadowElement = document.createElement("div");
            shadowElement.id = "shadow-element";
            //Shadow styles
            shadowElement.style.gridRow = `${Math.min(...rows)}/${Math.max(...rows)}`;
            shadowElement.style.gridColumn = `${Math.min(...columns)}/${Math.max(...columns)}`;
            shadowElement.style.outline = "2px solid aqua";
            //Show the shadow
            this.element.appendChild(shadowElement);
        }        
    }
})
window.addEventListener('resize', function() {
  figuresCreator.update(true);
});
figuresCreator.update(true);
