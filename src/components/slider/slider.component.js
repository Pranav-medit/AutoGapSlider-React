import { useRef, useEffect, useState } from 'react'
import * as React from 'react'
import styles from './slider.component.module.scss'
import _ from 'lodash'
import SliderCard from '../slider-card/slider-card.component'
import leftImg from './left.svg'

const AutoGapSlider = ({ settings, imgArrData }) => {
  const autoAdjustGap = settings?.autoAdjustGap ?? true
  const minGapBetweenSlideCards = settings?.minGapBetweenSlides ?? 0
  const autoMoveSlider = settings?.autoMoveSlider ?? false
  const autoMoveSliderInterval = settings?.autoMoveSliderInterval ?? 2000
  let slidesToScroll = settings?.slidesToScroll 
  const sliderCardWidth = settings?.sliderCardWidth ?? '200px'
  const sliderCardHeight = settings?.sliderCardHeight ?? '300px'
  const stopUponHover = settings?.stopUponHover ?? true
  // setInterval(() => {
  //   console.log(settings)
  // },1000)
  // Each slider card
  const childSliderCardRef = useRef()
  // Parent of slider cards , div holding all slide cards
  const divCardsContainer = useRef()
  // Slider containing cards container and prev, next buttons.
  const autoGapSliderMainContainer = useRef()
  // Grabbing next button
  const nextButton = useRef()
  // Grabbing prev button
  const prevButton = useRef()
  const [imgArr] = useState(imgArrData)
  // let imageUpdateArr=imgArr;
  // let id = 12;
  // let timerId;
  const [slideCardMargin, updateSlideCardMargin] = useState(20)
  const [translateValue, updateTranslateValue] = useState(0)
  // Initialize default values
  let sliderVisibleWidth = 0
  let eachSlideWidth = 0
  // let slidesToScroll = 0;
  let slidesToScrollWidth = 0
  let nextPxValueToScrl = 0
  let prevPxValueToScrl = 0
  let divCardsContainerTotalWidth = 0
  // Detect if we reached end of the slides
  let endOfSlide = false
  // Loadash throttler to throttle resize and if user clicks button many times
  let throttle = _.throttle((func, ...args) => {
    func(...args)
  }, 600)
  let debounce = _.debounce((func, ...args) => {
    func(...args)
    // console.log('deibounc')
  }, 800)
  const resetSliderPosition = () => {
    // default slidesToScrollWidth:240px
    nextPxValueToScrl = -slidesToScrollWidth
    prevPxValueToScrl = slidesToScrollWidth
    // divCardsContainer.current.style.cssText = `transform: translateX(-${0}px)`;
    updateTranslateValue(0)
    displayArrow('prev', false)
    divCardsContainerTotalWidth = divCardsContainer.current.offsetWidth
  }
  const displayArrow = (direction = 'prev', toDisplay = true) => {
    if (direction === 'prev') {
      if (!toDisplay) showPrevButton(false)
      else showPrevButton(true)
    } else {
      if (!toDisplay) showNextButton(false)
      else showNextButton(true)
    }
  }
  const updateSliderPositionRef = (updateref) => {
    // translateX(0) -> initial position, starting position
    // translateX(-240px) -> moves slide in -> direction by 240px(each slide width by default)
    if (updateref === 'next') {
      // minus position goes -> direction on translate
      // ex: prevPxValueToScrl=240,nextPxValueToScrl=-240  and slidesToScrollWidth=240
      prevPxValueToScrl = prevPxValueToScrl - slidesToScrollWidth
      // first-time:prevPxValueToScrl:0
      // second-time:prevPxValueToScrl:-240
      nextPxValueToScrl = nextPxValueToScrl - slidesToScrollWidth
      // first-time:nextPxValueToScrl:-480
      // second-time:nextPxValueToScrl:-720
    } else {
      // ex: prevPxValueToScrl=-240,nextPxValueToScrl=-720  and slidesToScrollWidth=240
      nextPxValueToScrl = nextPxValueToScrl + slidesToScrollWidth
      // first-time:prevPxValueToScrl:480
      // second-time:prevPxValueToScrl:620
      prevPxValueToScrl = prevPxValueToScrl + slidesToScrollWidth
      // first-time:nextPxValueToScrl:0
      // second-time:nextPxValueToScrl:240
    }
  }
  // future upgrade
  // const updateSliderArray = () =>{
  //     const newElement = [
  //         {
  //             'src':'static/per1.jpg',
  //             id:id,
  //         },
  //         {
  //             'src':'static/per2.jpg',
  //             id:id+1
  //         }
  //     ]
  //     // imgArr.push(...newElement)
  //     imageUpdateArr =  imageUpdateArr.concat(newElement)
  //     imgArrUpdt(imageUpdateArr );
  //     divCardsContainerTotalWidth = divCardsContainer.current.offsetWidth
  //     id = id+2;
  //     // // console.log(imgArrData)
  //     // clickHandler('next')
  // }
  const clickHandler = (direction) => {
    // If next button is clicked
    // divCardsContainerTotalWidth = divCardsContainer.current.offsetWidth
    if (direction === 'next') {
      displayArrow('prev', true)

      // If reached end of slide return to first slide
      if (endOfSlide) {
        // Return to first slide and reset positions of scroll reference
        resetSliderPosition()
        endOfSlide = false
        // ex: say divCardsContainerTotalWidth = 2360; and sliderVisibleWidth = 1336 and nextPxValueToScrl = -1440 then
        // sliderVisibleWidth is slider width which is visible to user
        // divCardsContainerTotalWidth is total width of container holding cards =  visible area+hidden area
      } else if (
        divCardsContainerTotalWidth -
          sliderVisibleWidth -
          slideCardMargin -
          10 <=
        -nextPxValueToScrl
      ) {
        // If slide is about to reach last slide , last but one click of endofslide
        // divCardsContainer.current.style.cssText = `transform: translateX(${-divCardsContainerTotalWidth+sliderVisibleWidth}px)`
        updateTranslateValue(-divCardsContainerTotalWidth + sliderVisibleWidth)
        // Update slider position reference, pass 'next' to update refrence with respect to next button click
        updateSliderPositionRef('next')
        endOfSlide = true
        // updateSliderArray()
      } else {
        // If everything is right translate to next px value
        // divCardsContainer.current.style.cssText = `transform: translateX(${nextPxValueToScrl}px)`
        updateTranslateValue(nextPxValueToScrl)
        // Update slider position reference, pass 'next' to update refrence with respect to next button click
        updateSliderPositionRef('next')
        endOfSlide = false
      }
    } else if (direction === 'prev') {
      // End of slide cannot be reached by clicking previous button
      endOfSlide = false
      if (
        prevPxValueToScrl > 0 ||
        prevPxValueToScrl + slidesToScrollWidth > 0
      ) {
        displayArrow('prev', false)
        // If slider is over left return to first slide and reset positions of scroll reference
        // ex: say by default reference prevPxValueToScrl is set to 240px hence this is executed
        resetSliderPosition()
      } else {
        displayArrow('prev', true)
        // If everything is right translate to prev px value
        // divCardsContainer.current.style.cssText = `transform: translateX(${prevPxValueToScrl}px)`;
        updateTranslateValue(prevPxValueToScrl)
        // Update slider position reference, pass 'prev' to update refrence with respect to next button click
        updateSliderPositionRef('prev')
      }
    }
  }
  const initValues = () => {
    endOfSlide = false
    // Slider width is an outer div which shows entire slider if we set slider to be 200px wide-
    // -width is set on this div , we need it to calculate slider visible width in which slider is visible
    // by default slider takes full viewport width.ex : 1600px
    sliderVisibleWidth = autoGapSliderMainContainer.current.offsetWidth
    // If slider has margin (space between slider cards if sliders are touch to each other then it has no margin)-
    // -it is required to calculate how much does slider scrolls
    let eachSlide = childSliderCardRef.current
    let eachslideCardMargin = window
      .getComputedStyle(eachSlide)
      .marginRight.slice(0, -2)
    // Convert from string to number and multiply it by two because margin is applied on both sides
    eachslideCardMargin = Number(eachslideCardMargin) * 2
    // Each slider card width is calculated by adding its own width with its own margin
    eachSlideWidth = eachSlide.offsetWidth + eachslideCardMargin
    // eachSlideWidth =Number(eachSlideWidth)
    // Number of slides to scroll
    // slidesToScroll = 1;
    // Number of slides to scroll in pixels ex: if 240px
    slidesToScrollWidth = slidesToScroll
      ? eachSlideWidth * slidesToScroll
      : sliderVisibleWidth
    // slidesToScrollWidth = sliderVisibleWidth;
    // to calculate and track progress of left and right scroll positions
    prevPxValueToScrl = slidesToScrollWidth // ex:240px
    nextPxValueToScrl = -slidesToScrollWidth // ex:-240px
    // Cards container width generally equal to eachsliderwidth*totalnumberofslides including margin ex: say 2090px
    divCardsContainerTotalWidth = divCardsContainer.current.offsetWidth
    displayArrow('prev', false)
  }

  // useEffect for number of slides to show per div
  function setSliderCardStyle(margin) {
    updateSlideCardMargin(margin)
  }
  function calculateMargin() {
    if (!autoAdjustGap) return
    const minGapBetweenSlides = minGapBetweenSlideCards
    const sliderVisibleWidth = autoGapSliderMainContainer.current.offsetWidth
    const eachSlideWidth =
      childSliderCardRef.current.offsetWidth + minGapBetweenSlides
    const slidesPerVisibleWidth = sliderVisibleWidth / eachSlideWidth
    const marginToSetInPercentage =
      slidesPerVisibleWidth - Math.floor(slidesPerVisibleWidth)
    const marginToSetInPx = marginToSetInPercentage * eachSlideWidth
    const marginPerSlide =
      marginToSetInPx / (Math.ceil(slidesPerVisibleWidth) - 1) +
      minGapBetweenSlides
    setSliderCardStyle(marginPerSlide)
  }
  useEffect(() => {
    // setTimeout(
    //   () =>{
    if (divCardsContainer.current) {
      divCardsContainerTotalWidth = divCardsContainer.current.offsetWidth
    }
    // },
    //     100
    // );
  }, [slideCardMargin, settings])
  // Useeffect for slider next and prev button
  useEffect(() => {
    let timerId
    // Execute when mounting
    // Initialize required values in particular function
    // let timerId;
    const nextBtn = nextButton.current
    const prevBtn = prevButton.current
    const autoGapSliderMainCont = autoGapSliderMainContainer.current
    const autoSliderMove = () => {
      if (!autoMoveSlider) return
      if (timerId) return
      if (autoMoveSlider) {
        timerId = setInterval(() => {
          throttle(clickHandler, 'next')
        }, autoMoveSliderInterval)
      }
    }
    const clearAutoSliderMove = (timerId) => {
      if (timerId) {
        clearTimeout(timerId)
        // timerId =null;
      }
    }
    calculateMargin()
    initValues()
    // displayContent(initvalues)
    // clearTimeout(timerId)
    autoSliderMove()
    // sliderStyle.transform('400px')
    // Handle click event for both buttons
    nextBtn.addEventListener('click', () => throttle(clickHandler, 'next'))
    prevBtn.addEventListener('click', () => throttle(clickHandler, 'prev'))
    function mouseEnterHandler() {
      clearAutoSliderMove(timerId)
      timerId = null
    }
    function mouseLeaveHandler() {
      autoSliderMove()
    }
    if (stopUponHover) {
      autoGapSliderMainCont.addEventListener('mouseenter', mouseEnterHandler)
      autoGapSliderMainCont.addEventListener('mouseleave', mouseLeaveHandler)
    }
    window.addEventListener('resize', () => {
      debounce(() => {
        calculateMargin()
        initValues()
        resetSliderPosition()
      })
    })
    return () => {
      // Execute when unmounting (cleanup)
      clearTimeout(timerId)
      nextBtn.removeEventListener('click', () => throttle(clickHandler, 'next'))
      prevBtn.removeEventListener('click', () => throttle(clickHandler, 'prev'))
      autoGapSliderMainCont.removeEventListener('mouseenter', mouseEnterHandler)
      autoGapSliderMainCont.removeEventListener('mouseleave', mouseLeaveHandler)
      window.removeEventListener('resize', () => {
        debounce(() => {
          calculateMargin()
          initValues()
          resetSliderPosition()
        })
      })
    }
  }, [slideCardMargin, settings])

  const dragHandler = (e) => {
    e.preventDefault()
  }
  const onImageLoad = (image, isImgReady) => {
    if (isImgReady) image.classList.remove('loading')
    else image.classList.add('loading')
  }
  // useEffect for touch capability
  useEffect(() => {
    let images = Array.from(document.getElementsByClassName('imageHolder'))
    const autoGapSliderMainCont = autoGapSliderMainContainer.current
    let touchStartPos = 0
    const touchStartHandler = (e) => {
      touchStartPos = e.changedTouches[0].clientX
    }
    const touchEndHandler = (e) => {
      let touchEndPos = e.changedTouches[0].clientX
      if (touchEndPos === touchStartPos) return
      if (touchEndPos - touchStartPos > 0) clickHandler('prev')
      else clickHandler('next')
    }
    images.forEach((image) => {
      onImageLoad(image, false)
      image.addEventListener('dragstart', (e) => dragHandler(e))
      image.addEventListener('load', (e) => onImageLoad(image, true))
    })
    autoGapSliderMainCont.addEventListener(
      'touchstart',
      (e) => touchStartHandler(e),
      { passive: true }
    )
    autoGapSliderMainCont.addEventListener(
      'touchend',
      (e) => touchEndHandler(e),
      { passive: true }
    )
    autoGapSliderMainCont.addEventListener(
      'touchmove',
      (e) => {
        console.log(e)
      },
      { passive: true }
    )
    // childSliderCardRef.current.removeEventListener('dragstart',(e)=>dragHandler(e) )
    // autoGapSliderMainContainer.current.addEventListener('touchmove',(e)=>touchStartHandler(e) )
    return () => {
      autoGapSliderMainCont.removeEventListener('touchstart', (e) =>
        touchStartHandler(e)
      )
      autoGapSliderMainCont.removeEventListener(
        'touchend',
        (e) => touchEndHandler(e),
        { passive: true }
      )
      images.forEach((image) => {
        image.removeEventListener('dragstart', (e) => dragHandler(e))
        image.removeEventListener('load', (e) => onImageLoad(e))
      })
      // autoGapSliderMainContainer.current.removeEventListener('touchmove',(e)=>touchStartHandler(e))
      // throttle(touchStartHandler,2000,e)
    }
  }, [])
  const [prevButtonDisplay, showPrevButton] = useState(true)
  const [nextButtonDisplay, showNextButton] = useState(true)
  // const leftStyle = {display:prevButtonDisplay?"inline-block":"none"}
  // const rightStyle = {display:nextButtonDisplay?"inline-btranslateX(translateValue)lock":"none"}
  // const sliderStyle = {transform: `translateX(${translateValue+'px'})` || '0'}
  return (
    <>
      <div
        id='visibleDiv'
        ref={autoGapSliderMainContainer}
        className={
          styles.autoGapSliderMainContainer + ' autoGapMainContainerDiv '
        }
      >
        <i
          ref={prevButton}
          style={sliderStyles.prevButton({ prevButtonDisplay })}
          className={styles.button + ' prev '}
        >
          Prev
        </i>

        <div
          style={sliderStyles.divCardsContainer({ translateValue })}
          ref={divCardsContainer}
          className={styles.divCardsContainer + ' imgComp '}
        >
          <SliderCard
            ref={childSliderCardRef}
            imgArr={imgArr}
            styleImg={sliderStyles.slideCardStyle({
              slideCardMargin,
              sliderCardWidth,
              sliderCardHeight
            })}
          />
        </div>
        <i
          ref={nextButton}
          style={sliderStyles.nextButton({ nextButtonDisplay })}
          className={styles.button + ' next '}
        >
          Next
        </i>
      </div>
      {/* <p id={styles["idea"]}>Namaste world</p> */}
    </>
  )
}
// Styles for slider
const sliderStyles = {
  divCardsContainer: ({ translateValue }) => ({
    transform: `translateX(${translateValue + 'px'})` || '0'
  }),
  nextButton: ({ nextButtonDisplay }) => ({
    display: nextButtonDisplay ? 'inline-block' : 'none'
  }),
  slideCardStyle: ({ slideCardMargin, sliderCardWidth, sliderCardHeight }) => ({
    width: sliderCardWidth,
    height: sliderCardHeight,
    margin: `0 ${slideCardMargin / 2}px 0 ${slideCardMargin / 2}px`
  }),
  prevButton: ({ prevButtonDisplay }) => ({
    display: prevButtonDisplay ? 'inline-block' : 'none'
  })
}
export default AutoGapSlider

// backgroundImage: `url(${'https://picsum.photos/500/100'})`,
