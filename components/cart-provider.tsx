"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { calculateShipping } from "@/lib/currency"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  total: number
  selectedShipping: string
  shippingCost: number
  finalTotal: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_SHIPPING"; payload: string }
  | { type: "CLEAR_CART" }

const TEST_PRODUCT_ID = (process.env.NEXT_PUBLIC_TEST_PRODUCT_ID || '').trim()

const hasTestProductHelper = (items: CartItem[]) => {
  if (TEST_PRODUCT_ID) {
    return items.some(i => String(i.id) === TEST_PRODUCT_ID || String((i as any)._id || '') === TEST_PRODUCT_ID)
  }
  return items.some(i => /test/i.test(i.id) || /test/i.test(i.name))
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  items: CartItem[]
  total: number
  selectedShipping: string
  shippingCost: number
  finalTotal: number
  hasTestProduct: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setShipping: (shippingId: string) => void
  clearCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  const hasTestProduct = (items: CartItem[]) => hasTestProductHelper(items)

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
  const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = hasTestProduct(updatedItems) ? 0 : calculateShipping(subtotal, state.selectedShipping)
        return {
          ...state,
          items: updatedItems,
          total: subtotal,
          shippingCost,
          finalTotal: subtotal + shippingCost,
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        const subtotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const shippingCost = hasTestProduct(newItems) ? 0 : calculateShipping(subtotal, state.selectedShipping)
        return {
          ...state,
          items: newItems,
          total: subtotal,
          shippingCost,
          finalTotal: subtotal + shippingCost,
        }
      }
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shippingCost = hasTestProduct(updatedItems) ? 0 : calculateShipping(subtotal, state.selectedShipping)
      return {
        ...state,
        items: updatedItems,
        total: subtotal,
        shippingCost,
        finalTotal: subtotal + shippingCost,
      }
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shippingCost = hasTestProduct(updatedItems) ? 0 : calculateShipping(subtotal, state.selectedShipping)
      return {
        ...state,
        items: updatedItems,
        total: subtotal,
        shippingCost,
        finalTotal: subtotal + shippingCost,
      }
    }
    case "SET_SHIPPING": {
      const shippingCost = hasTestProduct(state.items) ? 0 : calculateShipping(state.total, action.payload)
      return {
        ...state,
        selectedShipping: action.payload,
        shippingCost,
        finalTotal: state.total + shippingCost,
      }
    }
    case "CLEAR_CART": {
      return { 
        items: [], 
        total: 0, 
        selectedShipping: 'standard',
        shippingCost: 99.00,
        finalTotal: 0
      }
    }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    selectedShipping: 'standard',
    shippingCost: 99.00,
    finalTotal: 0
  })

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const setShipping = (shippingId: string) => {
    dispatch({ type: "SET_SHIPPING", payload: shippingId })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const isTestCart = hasTestProductHelper(state.items)

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        items: state.items,
        total: state.total,
        // expose a small boolean so UI can auto-select free shipping when appropriate
        hasTestProduct: isTestCart,
        selectedShipping: state.selectedShipping,
        shippingCost: state.shippingCost,
        finalTotal: state.finalTotal,
        addItem,
        removeItem,
        updateQuantity,
        setShipping,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
