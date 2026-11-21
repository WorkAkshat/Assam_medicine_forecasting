import React from 'react';
import { PHARMA_CATEGORIES } from '../../data/products';
import ProductCard from '../common/ProductCard';
import SectionHeader from '../common/SectionHeader';

export default function PharmaSection() {
  return (
    <section className="pt-2 sm:pt-4 lg:pt-5 pb-6 sm:pb-8 lg:pb-9 bg-white">
      <div className="site-container">
        
        {/* Section Header matching reference */}
        <div className="mb-6 sm:mb-7">
          <SectionHeader
            title="Pharmaceutical Products"
            subtitle="A diverse range of quality pharmaceutical formulations for everyday healthcare needs."
          />
        </div>

        {/* 4 Cards in Row matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PHARMA_CATEGORIES.map((category, index) => (
            <ProductCard
              key={category.id}
              item={category}
              index={index}
              basePath="/pharmaceutical-products"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
