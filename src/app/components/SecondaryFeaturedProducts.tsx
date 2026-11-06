'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../styles.module.css';
import './featured-products.css'; // Import des styles spécifiques pour les produits en vedette
import AddToCartNotification from './AddToCartNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner,
  faCartPlus,
  faStar,
  faStarHalfAlt
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { getAllProducts } from '@/services/product.service';
import { Product } from '@/types/database.types';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useFreeSampleModal } from '@/components/FreeSampleProvider';

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

const SecondaryFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [productsPerView, setProductsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartScrollLeft, setTouchStartScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inertiaRef = useRef<number | null>(null);
  const { addToCart } = useCart();
  const { triggerSampleModal } = useFreeSampleModal();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        const featuredProducts = allProducts.filter(product => product.is_featured);
        if (featuredProducts.length === 0) {
          const popularProducts = allProducts.filter(p => p.tag === 'Bestseller' || p.tag === 'Populaire');
          setProducts(popularProducts.length > 0 ? popularProducts : allProducts.slice(0, 3));
        } else {
          setProducts(featuredProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {};
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width <= 767;
      const tablet = width > 767 && width <= 1023;
      setIsMobile(mobile);
      setIsTablet(tablet);
      if (mobile) {
        setProductsPerView(2);
      } else if (tablet) {
        setProductsPerView(3);
      } else {
        setProductsPerView(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't add to cart if product is out of stock
    if (product.in_stock === false) return;
    
    // Add the product to the cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discounted_price || product.price_3g || product.base_price || 0,
      image: product.image_url || '/images/placeholder-product.jpg',
      description: product.description
    });
    
    // Show notification
    setShowNotification(true);
    
    // Trigger the free sample modal immediately (like product details page)
    setTimeout(() => {
      triggerSampleModal();
    }, 500);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const navigateToProduct = (productId: string) => {
    if (isDragging || dragDistance > 5) {
      return;
    }
    window.location.href = `/products/${productId}`;
  };

  const applyInertia = (initialVelocity: number) => {
    if (inertiaRef.current !== null) {
      cancelAnimationFrame(inertiaRef.current);
    }
    const deceleration = 0.95;
    let currentVelocity = initialVelocity;
    const animateInertia = () => {
      if (!containerRef.current || Math.abs(currentVelocity) < 0.5) {
        return;
      }
      containerRef.current.scrollLeft -= currentVelocity;
      currentVelocity *= deceleration;
      inertiaRef.current = requestAnimationFrame(animateInertia);
    };
    inertiaRef.current = requestAnimationFrame(animateInertia);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (inertiaRef.current !== null) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
    if (!containerRef.current) return;
    setIsDragging(true);
    setLastX(e.touches[0].pageX);
    setTouchStartX(e.touches[0].pageX);
    setTouchStartScrollLeft(containerRef.current.scrollLeft);
    setDragDistance(0);
    setVelocity(0);
    setLastMoveTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastMoveTime;
    const x = e.touches[0].pageX;
    const dx = x - lastX;
    setLastX(x);
    const newVelocity = Math.max(Math.min(dx / (timeElapsed || 1) * 16, 30), -30);
    setVelocity(newVelocity);
    setLastMoveTime(currentTime);
    const totalDx = x - touchStartX;
    setDragDistance(prev => prev + Math.abs(dx));
    if (isMobile) {
      const newScrollLeft = touchStartScrollLeft - totalDx * 0.8;
      containerRef.current.scrollLeft = newScrollLeft;
    } else {
      containerRef.current.scrollLeft -= dx * 0.3;
    }
    if (Math.abs(totalDx) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (isMobile && containerRef.current) {
      applyInertia(velocity);
    }
    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setLastX(e.pageX);
    setDragDistance(0);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX;
    const dx = x - lastX;
    setLastX(x);
    containerRef.current.scrollLeft -= dx * 0.5;
    setDragDistance(prev => prev + Math.abs(dx));
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.sectionTitle} style={{ marginTop: '80px' }}>
        <h2>Nos <span>Produits Phares</span></h2>
        <div className={styles.titleUnderline}></div>
      </div>
      {products.length > 0 ? (
        <>
          <div 
            className="slider-container"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              position: 'relative',
              padding: '0',
              overflow: 'hidden',
              paddingLeft: isMobile ? '10px' : isTablet ? '15px' : '20px',
              paddingRight: isMobile ? '10px' : isTablet ? '15px' : '20px',
            }}
          >
            <div
              ref={containerRef}
              className={isDragging ? 'slider-wrapper is-dragging' : 'slider-wrapper'}
              style={{
                display: 'flex',
                overflow: 'auto',
                scrollBehavior: isMobile ? 'auto' : 'smooth',
                WebkitOverflowScrolling: isMobile ? 'auto' : 'touch',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                scrollSnapType: isMobile ? 'none' : 'x mandatory',
                touchAction: 'pan-x',
                width: '100%',
                height: '100%',
                paddingBottom: '15px',
                transition: isMobile ? 'none' : 'all 0.3s ease'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                style={{
                  display: 'flex',
                  marginLeft: '0',
                  marginRight: '0',
                  paddingBottom: '15px',
                  width: '100%',
                  justifyContent: 'flex-start',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              >
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className={`featured-product-container ${index === 0 ? 'featured-product-container-first' : ''}`}
                    style={{
                      flex: `0 0 ${100 / productsPerView}%`,
                      boxSizing: 'border-box',
                      paddingRight: '20px',
                      scrollSnapAlign: 'start'
                    }}
                  >
                    <div 
                      className="featured-product-card-wrapper"
                      onClick={() => navigateToProduct(product.id)}
                    >
                      <div className="featured-product-card">
                        <div className="featured-product-image">
                          <Image 
                            src={product.image_url || '/images/placeholder-product.jpg'} 
                            alt={product.name}
                            width={300}
                            height={200}
                            style={{ objectFit: 'cover' }}
                          />
                          {product.tag && <div className="featured-product-tag">{product.tag}</div>}
                          
                          {/* Out of stock overlay */}
                          {product.in_stock === false && (
                            <div className="featured-product-out-of-stock-overlay">
                              <span className="featured-product-out-of-stock-text">Out of stock</span>
                            </div>
                          )}
                        </div>
                        <div className="featured-product-info">
                          <h3 className="featured-product-title">{product.name}</h3>
                          <p className="featured-product-description">
                            {product.description.length > 80 
                              ? `${product.description.substring(0, 80)}...` 
                              : product.description}
                          </p>
                          
                          {/* Star Rating */}
                          <div className="featured-product-rating">
                            {renderRating(product.rating || 0)}
                            {(product.rating && product.rating > 0) && (
                              <span className="featured-rating-count">
                                ({product.rating.toFixed(1)}) - {product.review_count || 0} avis
                              </span>
                            )}
                          </div>
                          
                          <div className="featured-product-price">
                            {product.discounted_price ? (
                              <div className="featured-product-price-container">
                                <span className="featured-product-price-original">
                                  {(product.price_3g || product.base_price || 0).toFixed(2)}€
                                </span>
                                <span className="featured-product-price-discount">
                                  {product.discounted_price.toFixed(2)}€
                                </span>
                              </div>
                            ) : (
                              <span className="featured-product-price-normal">
                                {(product.price_3g || product.base_price || 0).toFixed(2)}€
                              </span>
                            )}
                            <button 
                              className={`featured-add-to-cart-btn ${product.in_stock === false ? 'featured-disabled-btn' : ''}`}
                              onClick={(e) => handleAddToCart(e, product)}
                              aria-label="Ajouter au panier"
                              disabled={product.in_stock === false}
                            >
                              <FontAwesomeIcon icon={faCartPlus} />
                              <span>{product.in_stock !== false ? 'Ajouter' : 'Indisponible'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="featured-see-all-wrapper" style={{
            textAlign: 'center',
            marginTop: '0px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            <Link 
              href="/products" 
              className={styles.btnPrimary}
              style={{
                padding: '10px 25px',
                fontSize: '15px',
                maxWidth: '280px',
                whiteSpace: 'nowrap',
                position: 'relative',
                zIndex: 10
              }}
            >
              Voir tous nos produits
            </Link>
          </div>
        </>
      ) : (
        <p className={styles.noProducts}>
          Aucun produit disponible pour le moment
        </p>
      )}
      <AddToCartNotification 
        show={showNotification} 
        onClose={() => setShowNotification(false)} 
      />
    </>
  );
};

export default SecondaryFeaturedProducts; 