"use client"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock order data
const orderDetails = [
  { item: "Burger", price: 10.99 },
  { item: "Fries", price: 3.99 },
  { item: "Soda", price: 1.99 },
  { item: "Salad", price: 7.99 },
]

const totalPrice = orderDetails.reduce((sum, item) => sum + item.price, 0).toFixed(2)

export function FoodOrderAccessible() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const OrderContent = () => (
    <>
      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-2">Total Price</div>
        <div className="text-6xl font-extrabold text-primary" aria-live="polite">
          ${totalPrice}
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-center">Order Details</h3>
          {orderDetails.map((item, index) => (
            <div key={index} className="flex justify-between text-xl">
              <span>{item.item}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button size="lg" className="text-xl py-6">Pay Now</Button>
        <Button size="lg" variant="bordered" className="text-xl py-6">Cash Pay</Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="bordered" size="lg" className="text-xl py-6">View Order</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-3xl">Your Order</DrawerTitle>
            <DrawerDescription className="text-xl">Review your order details below</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-6">
            <OrderContent />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button color="danger" variant="flat" size="lg" className="text-xl py-6">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="bordered" size="lg" className="text-xl py-6">View Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">Your Order</DialogTitle>
          <DialogDescription className="text-xl text-center">Review your order details below</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <OrderContent />
        </div>
        <DialogFooter>
          <Button variant="flat" color="danger" size="lg" className="text-xl py-6" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}