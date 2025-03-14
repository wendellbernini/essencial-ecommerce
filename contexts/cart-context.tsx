"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

// Tipos
export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  sale_price?: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  total_items: number;
  isOpen: boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "TOGGLE_CART" }
  | { type: "SET_LOADING"; payload: boolean };

interface CartContextType extends CartState {
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
}

// Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );

      let newItems;
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Limite de 20 itens diferentes no carrinho
        if (state.items.length >= 20) {
          toast.error("Limite máximo de 20 itens diferentes no carrinho");
          return state;
        }
        newItems = [...state.items, action.payload];
      }

      const total = calculateTotal(newItems);
      const total_items = calculateTotalItems(newItems);

      return {
        ...state,
        items: newItems,
        total,
        total_items,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const total = calculateTotal(newItems);
      const total_items = calculateTotalItems(newItems);

      return {
        ...state,
        items: newItems,
        total,
        total_items,
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = calculateTotal(newItems);
      const total_items = calculateTotalItems(newItems);

      return {
        ...state,
        items: newItems,
        total,
        total_items,
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        total_items: 0,
        isOpen: false,
      };

    case "LOAD_CART": {
      const total = calculateTotal(action.payload);
      const total_items = calculateTotalItems(action.payload);

      return {
        ...state,
        items: action.payload,
        total,
        total_items,
      };
    }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    default:
      return state;
  }
}

// Funções auxiliares
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.sale_price || item.price;
    return total + price * item.quantity;
  }, 0);
}

function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    total_items: 0,
    isOpen: false,
  });

  const supabase = createClientComponentClient();

  // Carrega o carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  // Salva o carrinho no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  // Sincroniza com o Supabase para usuários logados
  useEffect(() => {
    const syncCartWithSupabase = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // TODO: Implementar sincronização com o Supabase
        // Por enquanto mantemos apenas no localStorage
      }
    };

    syncCartWithSupabase();
  }, [supabase, state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
