'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/contexts/CartContext';
import { useFreeSampleModal } from '@/components/FreeSampleProvider';
import { useState, useEffect } from 'react';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price?: number | null;
  base_price?: number;
  image: string;
  tag?: string;
  rating?: number;
  review_count?: number;
  isProductListPage?: boolean;
  in_stock?: boolean;
  onAddToCart?: () => void;
  customStyles?: {
    productCard?: React.CSSProperties;
    productPrice?: React.CSSProperties;
    price?: React.CSSProperties;
    addToCartBtn?: React.CSSProperties;
  };
}

// Fonction pour afficher les étoiles de notation
const renderRating = (rating: number = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} />);
  }
  
  if (hasHalfStar) {
    stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={farStar} />);
  }

  return stars;
};

const ProductCard = ({ 
  id, 
  name, 
  description, 
  price, 
  discounted_price,
  base_price,
  image, 
  tag,
  rating = 0,
  review_count = 0,
  isProductListPage = false,
  in_stock = true,
  onAddToCart,
  customStyles = {}
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { triggerSampleModal } = useFreeSampleModal();
  const [adding, setAdding] = useState(false);
  const [truncatedDescription, setTruncatedDescription] = useState('');
  
  // Déterminer le prix à afficher
  const displayPrice = base_price && base_price > 0 ? base_price : price;
  
  // Déterminer si le produit a un prix réduit
  const hasDiscount = discounted_price !== null && discounted_price !== undefined && discounted_price > 0;
  
  // Déterminer le prix à afficher dans le panier (le prix réduit s'il existe)
  const cartPrice = hasDiscount ? discounted_price : displayPrice;

  // Truncate description based on page context
  useEffect(() => {
    if (isProductListPage) {
      // For product list page, truncate to 3 words
      const words = description.split(/\s+/);
      if (words.length > 3) {
        setTruncatedDescription(words.slice(0, 3).join(' ') + '...');
      } else {
        setTruncatedDescription(description);
      }
    } else {
      // For home page, keep the original 9 words truncation
      const words = description.split(/\s+/);
      if (words.length > 9) {
        setTruncatedDescription(words.slice(0, 9).join(' ') + '...');
      } else {
        setTruncatedDescription(description);
      }
    }
  }, [description, isProductListPage]);

  const handleAddToCart = (e: React.MouseEvent) => {
    // Stop propagation to prevent navigation when clicking the cart button
    e.preventDefault();
    e.stopPropagation();
    
    // Don't add to cart if product is out of stock
    if (!in_stock) return;
    
    setAdding(true);
    
    // Add the product to the cart
    addToCart({
      id,
      name,
      price: cartPrice,
      image,
      description
    });
    
    // Show feedback for a short time and trigger sample modal
    setTimeout(() => {
      setAdding(false);
      onAddToCart?.();
      triggerSampleModal(); // Show free sample modal after adding to cart
    }, 500);
  };

  return (
    <>
      <Link href={`/products/${id}`} className="product-card-link-fixed">
        <div className="product-card-fixed" style={customStyles.productCard}>
          <div className="product-image-fixed">
            <Image 
              src={image} 
              alt={name}
              width={300}
              height={150}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            {tag && <div className="product-tag-fixed">{tag}</div>}
            
            {/* Out of stock overlay */}
            {!in_stock && (
              <div className="product-out-of-stock-overlay">
                <span className="product-out-of-stock-text">Out of stock</span>
              </div>
            )}
          </div>
          <div className="product-info-fixed">
            <h3 className="product-title-fixed">{name}</h3>
            <p className="product-description-fixed">{truncatedDescription}</p>
            
            {/* Star Rating */}
            <div className="product-rating-fixed">
              {renderRating(rating)}
              {rating > 0 && (
                <span className="rating-count-fixed">
                  ({rating.toFixed(1)}) - {review_count} avis
                </span>
              )}
            </div>
            
            <div className="product-price-fixed" style={customStyles.productPrice}>
              {hasDiscount ? (
                <div className="product-price-container-fixed">
                  <span className="product-price-original-fixed">
                    {displayPrice.toFixed(2)}€
                  </span>
                  <span className="product-price-discount-fixed">
                    {discounted_price?.toFixed(2)}€
                  </span>
                </div>
              ) : (
                <span className="product-price-normal-fixed" style={customStyles.price}>
                  {displayPrice.toFixed(2)}€
                </span>
              )}
              <button 
                className={`add-to-cart-btn-fixed ${!in_stock ? 'disabled-btn-fixed' : ''}`}
                onClick={handleAddToCart}
                aria-label="Ajouter au panier"
                disabled={adding || !in_stock}
                style={customStyles.addToCartBtn}
              >
                <FontAwesomeIcon icon={faCartPlus} />
                <span>{in_stock ? 'Ajouter' : 'Indisponible'}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard; 