"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'

export default function ProductActionsClient({ product }: { product: { id: string, name: string, price: number, image_url?: string } }) {
  const router = useRouter()
  const { addItem } = useCart()

  const handleBack = () => {
    router.back()
  }

  const handleAdd = () => {
    // add minimal item payload expected by cart
    addItem({ id: String(product.id), name: product.name, price: Number(product.price), image: product.image_url ?? '' })
    // navigate to cart or stay — we'll stay and show a quick confirm via router.refresh
    router.refresh()
  }

  return (
    <>
      <Button onClick={handleBack}>Back</Button>
      <Button onClick={handleAdd}>Add to cart</Button>
    </>
  )
}
