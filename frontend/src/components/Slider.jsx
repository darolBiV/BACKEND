import { useState } from "react";
import "./Slider.css";

function Slider({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  const changeSlide = (newIndex) => {
    setIsVisible(false);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsVisible(true);
    }, 180);
  };

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    changeSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    changeSlide(newIndex);
  };

  return (
    <div className="slider">
      <div className="slider-image-wrap">
        <img
          src={images[currentIndex]}
          alt={title}
          className={`slider-image ${isVisible ? "visible" : "hidden"}`}
        />

        <button
          type="button"
          className="slider-nav slider-nav-left"
          onClick={handlePrev}
        >
          ‹
        </button>

        <button
          type="button"
          className="slider-nav slider-nav-right"
          onClick={handleNext}
        >
          ›
        </button>
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`slider-dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => changeSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;