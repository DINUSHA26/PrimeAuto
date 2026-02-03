import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isLoadedFromDb, setIsLoadedFromDb] = useState(false);
    const isInitialMount = useRef(true);

    // Fetch cart from database on login
    useEffect(() => {
        const fetchCart = async () => {
            if (isAuthenticated) {
                try {
                    const { data } = await api.get('/cart');
                    if (data.data && data.data.items) {
                        const dbItems = data.data.items.map(item => ({
                            ...item.product,
                            quantity: item.quantity,
                            _id: item.product._id,
                            image: item.image
                        }));

                        setCartItems(prev => {
                            // Merge: DB items take precedence
                            const merged = [...dbItems];
                            prev.forEach(localItem => {
                                if (!merged.find(di => di._id === localItem._id)) {
                                    merged.push(localItem);
                                }
                            });
                            return merged;
                        });
                    }
                    setIsLoadedFromDb(true);
                } catch (err) {
                    console.error('Error fetching cart from DB', err);
                    setIsLoadedFromDb(true); // Allow sync even if fetch fails
                }
            } else {
                setIsLoadedFromDb(false);
            }
        };

        fetchCart();
    }, [isAuthenticated]);

    // Handle cart persistence to LocalStorage and Backend
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));

        const syncWithBackend = async () => {
            if (isAuthenticated && isLoadedFromDb) {
                try {
                    await api.post('/cart/sync', {
                        items: cartItems.map(item => ({
                            product: item._id,
                            name: item.name,
                            price: item.price,
                            image: item.image || item.imageUrl,
                            quantity: item.quantity
                        }))
                    });
                } catch (err) {
                    console.error('Error syncing cart to backend', err);
                }
            }
        };

        if (!isInitialMount.current || !isAuthenticated) {
            syncWithBackend();
        }
        isInitialMount.current = false;
    }, [cartItems, isAuthenticated, isLoadedFromDb]);

    // Clear cart on logout
    useEffect(() => {
        if (!isAuthenticated && !isInitialMount.current) {
            setCartItems([]);
            localStorage.removeItem('cart');
        }
    }, [isAuthenticated]);




    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item._id === product._id);
            if (existingItem) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item => (item._id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemsCount,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
