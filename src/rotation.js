
export default class Image360Rotation {

	mouseOnClickXLocation = undefined;

	/*
	@param identifier: ID of the element that contains the images
	@param rotationSpeed: Speed how far the mouse must be moved to rotate
	@param reversed: Reverse the roation
	 */
	constructor(identifier, rotationSpeed = 50, reversed = false){
		this.identifier = identifier
		this.rotationSpeed = rotationSpeed
		this.reversed = reversed
		this.rotationArea = document.querySelector(`#${this.identifier}`)
		this.images = this.rotationArea.querySelectorAll('img')
		this.rotateMethod = this.onRotate.bind(this)

		this.images.forEach((el)=>{
			el.setAttribute('draggable', false);
			el.dataset.focused = "0"
		})
		this.images[0].dataset.focused = "1"

		this.initListeners()
		this.updateVisibilityByDataFocused()
	}

	initListeners(){
		this.rotationArea.addEventListener('mousedown', (event)=>{
			this.mouseOnClickXLocation = event.offsetX
			this.rotationArea.addEventListener('mousemove', this.rotateMethod)
		})
		
		// Removing listeners on certain mouse events
		this.rotationArea.addEventListener('mouseup', (event)=>{
			this.mouseOnClickXLocation = undefined
			this.setDataFocusedToVisibleImage()
			this.rotationArea.removeEventListener('mousemove', this.rotateMethod)
		})
		
		this.rotationArea.addEventListener('mouseleave', (event)=>{
			this.mouseOnClickXLocation = undefined
			this.setDataFocusedToVisibleImage()
			this.rotationArea.removeEventListener('mousemove', this.rotateMethod)
		})
	
	}

	getFocusedIndex(){
		let focusedIndex = undefined
		for(let i = 0; i < this.images.length; i++){
			if(this.images[i].dataset.focused == "1"){
				focusedIndex = i
				break;
			}
		}
		if(focusedIndex === undefined){
			focusedIndex = 0
		} else {
			return focusedIndex
		}
	}

	setDataFocusedToVisibleImage(){
		this.images.forEach((image)=>{
			if(image.style.visibility == "visible"){
				image.dataset.focused = "1"
			} else {
				image.dataset.focused = "0"
			}
		})
	}

	updateVisibilityByDataFocused(){
		this.images.forEach((image)=>{
			image.style.visibility = "hidden"
			if(image.dataset.focused == "1"){
				image.style.visibility = "visible"
			}
		})
	}
	
    onRotate(e){
        const currentMouseXLocation = e.screenX;
        let offset = Math.round(((currentMouseXLocation - this.mouseOnClickXLocation) / this.rotationSpeed))

        let focusedIndex = this.getFocusedIndex()

		if(this.reversed){
			offset *= -1
		}

        let newIndex = undefined
        if(offset === 0) return
        if(offset < 0){
            for(let i = offset, j = focusedIndex; i < 0; i++){
                j -= 1
                if(j === -1){
                    j = this.images.length - 1;
                }
                newIndex = j
            }
        } else {
            for(let i = offset, j = focusedIndex; i > 0; i--){
                j += 1
                if(j === this.images.length){
                    j = 0;
                }
                newIndex = j
            }
        }

        if(this.images[newIndex].style.visibility === "visible") return

        this.images.forEach((image)=>{
            image.style.visibility = "hidden"
        })
		
        this.images[newIndex].style.visibility = "visible"
    }

}
