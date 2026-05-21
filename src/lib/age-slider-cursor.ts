export const AGE_SLIDER_DRAGGING_CLASS = 'age-slider-dragging'

export function setAgeSliderDragging(active: boolean) {
  document.body.classList.toggle(AGE_SLIDER_DRAGGING_CLASS, active)
}
