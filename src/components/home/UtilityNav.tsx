// src/components/GrandMarquee/UtilityNav.tsx
import React, { useState } from 'react';
import { FaRegUser, FaSearch, FaShoppingBag, FaTimes } from 'react-icons/fa'; // Example icons
import {
    UtilityNavContainer,
    SearchContainer,
    UserCartIcons,
    CartIconContainer,
    CartCount,
    MiniCartOverlay,
    MiniCartHeader,
    MiniCartItems,
    MiniCartItem,
    MiniCartFooter
} from './styles/UtilityNav.styles';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

const UtilityNav: React.FC = () => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems] = useState<CartItem[]>([ // Dummy data for demonstration
        { id: '1', name: 'Ceramic Plate Set', price: 65.00, quantity: 1, image: 'https://via.placeholder.com/70x70/F8F8F0/A46E4A?text=Plate' },
        { id: '2', name: 'Hand-woven Rug', price: 299.00, quantity: 1, image: 'https://via.placeholder.com/70x70/F8F8F0/9EB78A?text=Rug' },
    ]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <UtilityNavContainer>
            <SearchContainer $isExpanded={isSearchExpanded}>
                <input
                    type="text"
                    placeholder="Search..."
                    aria-label="Search"
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => setIsSearchExpanded(false)}
                />
                <button onClick={() => setIsSearchExpanded(!isSearchExpanded)} aria-label="Toggle search">
                    <FaSearch />
                </button>
            </SearchContainer>

            <UserCartIcons>
                <button aria-label="User Account">
                    <FaRegUser />
                </button>
                <button onClick={() => setIsCartOpen(!isCartOpen)} aria-label="Shopping Cart">
                    <CartIconContainer>
                        <FaShoppingBag />
                        {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
                    </CartIconContainer>
                </button>
            </UserCartIcons>

            {/* Mini Cart Overlay */}
            <MiniCartOverlay $isOpen={isCartOpen}>
                <MiniCartHeader>
                    <h3>Your Cart ({totalItems})</h3>
                    <button onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                        <FaTimes />
                    </button>
                </MiniCartHeader>
                <MiniCartItems>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <MiniCartItem key={item.id}>
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-qty-price">{item.quantity} x ${item.price.toFixed(2)}</p>
                                </div>
                            </MiniCartItem>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>Your cart is empty.</p>
                    )}
                </MiniCartItems>
                <MiniCartFooter>
                    <div className="subtotal">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <button>View Cart</button>
                    <button>Checkout</button>
                </MiniCartFooter>
            </MiniCartOverlay>
        </UtilityNavContainer>
    );
};

export default UtilityNav;