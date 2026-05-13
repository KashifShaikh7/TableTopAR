export const tapPlaceComponent = {
  init() {
    const ground = document.getElementById('ground')

    this.prompt = document.getElementById('promptText')

    this.placedObject = null

    let isDragging = false
    let previousX = 0
    let previousDistance = 0

    // PLACE BUILDING
    ground.addEventListener('click', (event) => {
      // prevent multiple placements
      if (this.placedObject) return

      this.prompt.style.display = 'none'

      const newElement = document.createElement('a-entity')

      const touchPoint = event.detail.intersection.point

      newElement.setAttribute('position', touchPoint)

      newElement.setAttribute('rotation', '0 0 0')

      newElement.setAttribute('visible', 'false')

      // tiny start scale for pop animation
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('gltf-model', '#buildingModel')

      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        newElement.setAttribute('visible', 'true')

        newElement.setAttribute('animation', {
          property: 'scale',
          to: '1 1 1',
          easing: 'easeOutElastic',
          dur: 800,
        })
      })

      this.placedObject = newElement
    })

    // ROTATE
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true
        previousX = e.touches[0].clientX
      }

      // pinch start
      if (e.touches.length === 2) {
        previousDistance = this.getDistance(e.touches)
      }
    })

    window.addEventListener('touchmove', (e) => {
      if (!this.placedObject) return

      // ROTATION
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousX

        previousX = e.touches[0].clientX

        const rotation = this.placedObject.getAttribute('rotation')

        this.placedObject.setAttribute('rotation', {
          x: rotation.x,
          y: rotation.y + deltaX * 0.5,
          z: rotation.z,
        })
      }

      // PINCH SCALE
      if (e.touches.length === 2) {
        const currentDistance = this.getDistance(e.touches)

        const scale = this.placedObject.getAttribute('scale')

        let newScale = scale.x + (currentDistance - previousDistance) * 0.005

        // clamp scale
        newScale = Math.max(0.3, Math.min(newScale, 5))

        this.placedObject.setAttribute('scale', {
          x: newScale,
          y: newScale,
          z: newScale,
        })

        previousDistance = currentDistance
      }
    })

    window.addEventListener('touchend', () => {
      isDragging = false
    })
  },

  // helper function
  getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY

    return Math.sqrt(dx * dx + dy * dy)
  },
}