class FullResizableElements {
	topProp = { height: 0, discrepancy: 0 };
	bottomProp = { height: 0, discrepancy: 0 };
	leftProp = { width: 0, discrepancy: 0 };
	rightProp = { width: 0, discrepancy: 0 };
	options({element, container}) {
		this.element = document.querySelector(element);
		this.elementSelector = element;
		this.container = document.querySelector(container);
		this.wData = {d: this.element.offsetWidth / this.container.offsetWidth * 100};
		this.hData = {d: this.element.offsetHeight / this.container.offsetHeight * 100};
	}
	control({ axis, direction, n1, n2, side }) {
		let dato1 = this.wData;
		let dato2 = this.hData;
		let element = this.element;
		let elementSelector = this.elementSelector;
		let topProp = this.topProp;
		let bottomProp = this.bottomProp;
		let leftProp = this.leftProp;
		let rightProp = this.rightProp;
		let container = this.container;
		function maxSizeShared(width, active) {
			let computedElement = window.getComputedStyle(element);
			let value = Math.floor(parseInt(computedElement.getPropertyValue(
				width
				? active ? 'left' : 'right'
				: active ? 'top' : 'bottom'
			)));
			if (value < 0) {
				value = 0;
			}
			element.style[width ? 'maxWidth' : 'maxHeight'] = `calc(100% - ${value / (width ? container.offsetWidth : container.offsetHeight) * 100}% - 1px)`;	

		}
		function maxWidth(left) {
			maxSizeShared(true, left);
		}
		function maxHeight(top) {
			maxSizeShared(false, top);
		}
		function shared(X, left, top) {
			return X
			? left ? rightProp.discrepancy : leftProp.discrepancy
			: top ? bottomProp.discrepancy : topProp.discrepancy;
		}
		function start(X, left, top, sideParam, e) {
			//Define discrepancy by axis and side
		  	const discrepancyToSubtract = shared(X, left, top);
			//console.log(discrepancyToSubtract)
			//Remove opposite to side property
		  	const propertyToRemove = X
		  	? left ? "right" : "left"
		  	: top ? "bottom" : "top";
			element.style.removeProperty(propertyToRemove);
			//Apply Absolute Positions Styles
			element.style[sideParam] = `calc(25% - ${discrepancyToSubtract}%)`;
			//Apply max-width Styles and fix size styles
			element.style[X ? "width" : "height"] = (X ? dato1.d : dato2.d) + "%";
			if (X) {maxWidth(left)}else {maxHeight(top)}
		}
		function resize(X, OP, e) {
		  	//Define total
		  	const windowSize = X ? container.offsetWidth : container.offsetHeight;
		  	//Define event.client axis
		  	const diff = X ? event.clientX - e.startPositionX : event.clientY - e.startPositionY;
		  	//Define original size axis
		  	const originalSize = X ? e.originalSizeWidth : e.originalSizeHeight;
		  	//Define opposite or ahead calculus
		  	const prev = OP ? originalSize - diff : originalSize + diff;
		  	//Convert and apply values
		  	element.style[X ? "width" : "height"] = prev / windowSize * 100 + "%";
		}
		function end(X, left, top, e) {
		  	//Discrepancy
		  	const discrepancyToSubtract = shared(X, left, top);
			//Define object access by axis and side
			const prop = X 
			? left ? leftProp : rightProp
			: top ? topProp : bottomProp;
			//Define behavior by axis
			prop[X ? "width" : "height"] = 
			element[X ? "offsetWidth" : "offsetHeight"] - discrepancyToSubtract / 100 * (X ? container.offsetWidth : container.offsetHeight);
			//Define elected side discrepancy property
			prop.discrepancy = prop[X ? "width" : "height"] / (X ? container.offsetWidth : container.offsetHeight) * 100 - 50;
			//Save Width and Height for fixing it then
			if (X) {	
				dato1.d = element.offsetWidth / container.offsetWidth * 100 ;
			} else {	
				dato2.d = element.offsetHeight  / container.offsetHeight * 100 ;
			}
		}
	  	applyResizeEvent(`${elementSelector} > div:nth-of-type(${n1}) > span:nth-of-type(${n2})`, elementSelector, 
	  		(event)=>{
	  			if (axis !== "xy") {
	  				start(axis === "x", side === "left", side === "top", side, event);
	  			} else {
	  				start(false, side.n2 === "left", side.n1 === "top", side.n1, event);
	  				start(true, side.n2 === "left", side.n1 === "top", side.n2, event);
	  			}
	  		},
	  		(event)=>{
	  			if (axis !== "xy") {
	  				resize(axis === "x", direction === "oposite", event);
	  			} else {
		  			resize(false, direction.n1 === "oposite", event);
		  			resize(true, direction.n2 === "oposite", event);
	  			}
	  		},
	  		(event)=>{
	  			if (axis !== "xy") {
	  				end(axis === "x", side === "left", side === "top", event);
	  			} else {
	  				end(false, side.n2 === "left", side.n1 === "top", event);
	  				end(true, side.n2 === "left", side.n1 === "top", event);
	  			}
	  		}
	  	);
	}
}
let fre = new FullResizableElements;
fre.options({element: '#cont', container: '#resize-art'});
//X AXIS PROCESS
//Oposite
fre.control({
	axis: "x",
	direction: "oposite",
	n1: 1,
	n2: 2,
	side: "right"
});
//ahead
fre.control({
	axis: "x",
	direction: "ahead",
	n1: 3,
	n2: 2,
	side: "left"
})

//Y AXIS PROCESS
//Oposite
fre.control({
	axis: "y",
	direction: "oposite",
	n1: 2,
	n2: 1,
	side: "bottom"
})
//ahead
fre.control({
	axis: "y",
	direction: "ahead",
	n1: 2,
	n2: 3,
	side: "top"
})

//CORNER DIRECTIONS
//bottom-right
fre.control({
	axis: "xy",
	direction: {
		n1: "ahead",
		n2: "ahead"
	},
	n1: 3,
	n2: 3,
	side: {
		n1: "top",
		n2: "left"
	}

})
//bottom-left
fre.control({
	axis: "xy",
	direction: {
		n1: "ahead",
		n2: "oposite"
	},
	n1: 1,
	n2: 3,
	side: {
		n1: "top",
		n2: "right"
	}
})
//top-right
fre.control({
	axis: "xy",
	direction: {
		n1: "oposite",
		n2: "ahead"
	},
	n1: 3,
	n2: 1,
	side: {
		n1: "bottom",
		n2: "left"
	}
})
//top-left
fre.control({
	axis: "xy",
	direction: {
		n1: "oposite",
		n2: "oposite"
	},
	n1: 1,
	n2: 1,
	side: {
		n1: "bottom",
		n2: "right"
	}
})