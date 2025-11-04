
import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative">
        <div onClick={() => onProductClick(product.id)} className="cursor-pointer">
            <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
        </div>
        <div className="absolute top-2 right-2 flex space-x-1">
            {product.tags.includes(2) && <span className="text-xs bg-red-500 text-white font-semibold px-2 py-1 rounded-full">Sale</span>}
            {product.tags.includes(1) && <span className="text-xs bg-blue-500 text-white font-semibold px-2 py-1 rounded-full">New</span>}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 
            onClick={() => onProductClick(product.id)}
            className="text-lg font-semibold text-gray-800 truncate cursor-pointer hover:text-indigo-600"
        >
            {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 flex-grow">{product.description.substring(0, 50)}...</p>
        <div className="mt-4 flex items-baseline justify-between">
            <div>
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                )}
            </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
