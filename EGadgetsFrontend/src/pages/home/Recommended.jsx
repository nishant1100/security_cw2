import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCard from '../products/ProductCard';
import { useFetchAllProductsQuery } from '../../redux/features/products/productApi';

const Recommended = () => {
    const { data: products = [] } = useFetchAllProductsQuery();

    // Filter products that are trending
    const trendingProducts = products.filter(product => product.trending === true);

    return (
        <div className='py-16'>
            <h2 className='text-3xl font-semibold mb-6'>Trending Products</h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation={true}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                    1180: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >
                {
                    // Only map through trending products
                    trendingProducts.length > 0 ? trendingProducts.map((product, index) => (
                        <SwiperSlide key={index}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    )) : <p>No trending products available</p>
                }

            </Swiper>
        </div>
    )
}

export default Recommended
