import React from 'react';
import UserNav from '../../Components/Nav/userNav';
import Products from '../../Components/Inventory_Management/Products';
import Footer from '../../Components/Nav/footer';
import ImageSlider from '../../Components/Nav/imageSlider';
import './HomePage.css';

function HomePage() {
  function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <UserNav />

      <section className="home flex justify-between items-center m-5">
        <div className="relative overflow-hidden rounded-lg bg-cover bg-no-repeat p-8 text-center w-full">
          <div className="slider-container">
            <ImageSlider />
          </div>
          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-fixed overlay">
            <div className="flex h-full items-center justify-center">
              <div className="text-white">
                <h2 className="mb-4 text-4xl font-semibold">Heading</h2>
                <h4 className="mb-6 text-xl font-semibold">
                  Welcome to our online mobile phone shop!
                </h4>
                <button
                  type="button"
                  className="rounded border-2 border-neutral-50 px-7 pb-[8px] pt-[10px] text-sm font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                  data-twe-ripple-init
                  data-twe-ripple-color="light"
                  onClick={() => scrollToSection('section1')}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="section1">
        <div id="product-cards">
          <h1 className="text-center">PRODUCTS</h1>
          <Products />
        </div>
      </div>

      <div id="footer">
        <Footer />
      </div>

      <a href="#" className="arrow">
        <i>
          <img src="/image/arrow.png" alt="ar" />
        </i>
      </a>
    </>
  );
}

export default HomePage;
