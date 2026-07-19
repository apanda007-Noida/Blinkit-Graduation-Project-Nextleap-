"use client";

import { useState, useEffect } from "react";
import Chatbot from "../components/Chatbot";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [cartState, setCartState] = useState<any>({ subtotal: 0, total: 0 });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      })
      .then(res => res.json())
      .then(data => setCartState(data));
    } else {
      setCartState({ subtotal: 0, total: 0 });
    }
  }, [cart]);

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  return (
    <div className="container">
      <header>
        <div className="header-title">blinkit</div>
      </header>

      <h1 className="feed-title">Discover New Categories</h1>
      
      <div className="product-grid">
        {products.map(product => {
          const inCart = cart.find(item => item.id === product.id);
          return (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="trust-badge-container">
                {product.tags.map((tag: string, i: number) => (
                  <span key={i} className={`trust-badge ${product.friction === 'High' ? 'high-friction' : ''}`}>
                    {product.friction === 'High' && tag.includes('Guarantee') ? '🛡️ ' : '✨ '}
                    {tag}
                  </span>
                ))}
              </div>
              <div className="product-name">{product.name}</div>
              <div className="price-row">
                <span className="price">₹{product.price}</span>
                <button 
                  className={`add-btn ${inCart ? 'added' : ''}`}
                  onClick={() => addToCart(product)}
                  disabled={!!inCart}
                >
                  {inCart ? 'ADDED' : 'ADD'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div className="cart-drawer">
          <div className="cart-header">
            <span>Your Cart ({cart.length} items)</span>
          </div>
          
          {cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          
          <div className="cart-divider"></div>
          
          <div className="cart-fee">
            <span>Item Total</span>
            <span>₹{cartState.subtotal}</span>
          </div>
          
          <div className={`cart-fee ${cartState.hasHighFrictionCategory ? 'waived' : ''}`}>
            <span>Handling Fee</span>
            <div>
              {cartState.hasHighFrictionCategory && <span className="fee-val">₹15</span>}
              <span>{cartState.hasHighFrictionCategory ? 'FREE' : '₹15'}</span>
            </div>
          </div>
          
          <div className="cart-total">
            <span>Grand Total</span>
            <span>₹{cartState.total}</span>
          </div>
          
          <div className="cart-msg">
            {cartState.message}
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}
