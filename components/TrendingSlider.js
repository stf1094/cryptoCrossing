import React, {useState, useCallback, useEffect} from 'react';
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

function TrendingSlider({ hot7 }) {
  const [sliderData, setSliderData] = useState(hot7);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    duration: 35,
    dragThreshold: 10,
    containScroll: 'keepSnaps',
    skipSnaps: false,
  });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])
 
 useEffect(() => {
  // console.log("sliderData: ", sliderData);
  // console.log("hot: ", hot7);
  setSliderData(hot7);
 }, []);
  return (
    <div className="embla overflow-hidden">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container hover:cursor-pointer">
          {sliderData && sliderData.map((item, index) => (
              <div className="embla__slide" key={index}>
                    <div className="border border-slate-400 bg-white flex flex-row px-3 py-3 rounded-lg h-full">
                        <div className="flex flex-column w-1/2">
                          <div className='flex flex-row'>
                            <img className="price-table-coin-image" alt="coin-logo" src={item.image} />
                            <div>
                              <span className="text-sm font-bold">{item.name}</span>
                              <p className='text-md'>${item.current_price}</p>
                            </div>
                            </div>
                        </div>
                        <div className="flex flex-column text-right justify-between w-1/2">
                          <span className="text-sm green">30d</span>
                          <span className="xs:text-xl sm:text-2xl lg:text-3xl green">
                          <FontAwesomeIcon className="green xs:mr-2 xl:mr-0" icon={faArrowTrendUp} />
                        {/*   <ArrowTrendingUpIcon className="h-10 w-10 inline-block" /> */}
                          {item.price_change_percentage_30d_in_currency.toFixed(1)}%</span>
                        </div>
                      </div>
              </div>
           ))}
        </div>
         <button className="embla__prev mr-2" onClick={scrollPrev}>
          Prev
        </button>
        <button className="embla__next" onClick={scrollNext}>
          Next
        </button>
      </div>
    </div>
  )
}

export default TrendingSlider;