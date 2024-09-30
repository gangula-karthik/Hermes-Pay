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
import { Volume2 } from "lucide-react"  // Changed from VolumeUp to Volume2

// Mock order data
const orderDetails = [
  { item: "Burger", price: 10.99 },
  { item: "Fries", price: 3.99 },
  { item: "Soda", price: 1.99 },
  { item: "Salad", price: 7.99 },
]

const totalPrice = orderDetails.reduce((sum, item) => sum + item.price, 0).toFixed(2)

// Mock AI recommendation
const aiRecommendation = "Great choice! Your meal is balanced with protein from the burger, carbs from the fries, and vitamins from the salad. Consider adding a fruit dessert for extra nutrition!"

export function FoodOrderAccessibleAi() {
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

  const speakRecommendation = () => {
    const utterance = new SpeechSynthesisUtterance(aiRecommendation)
    speechSynthesis.speak(utterance)
  }

  const OrderContent = () => (
    <>
      <div className="text-center mb-6">
        <div className="text-3xl font-bold mb-2">Total Price</div>
        <div className="text-5xl font-extrabold text-primary" aria-live="polite">
          ${totalPrice}
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 overflow-auto">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Order Details</h3>
          {orderDetails.map((item, index) => (
            <div key={index} className="flex justify-between text-lg">
              <span>{item.item}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-6 p-4 bg-secondary rounded-lg">
        <h4 className="text-lg font-semibold mb-1">AI Rec 🤖</h4>
        <p className="text-md mb-1">{aiRecommendation}</p>
        <Button 
          onClick={speakRecommendation} 
          variant="bordered" 
          className="w-full"
          size="sm"
        >
          <Volume2 className="mr-1 h-4 w-4" />
          Read
        </Button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button color="primary">Pay Now 📱</Button>
        <Button color="secondary">Cash Pay 💵</Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="bordered" >View Order</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="px-4 py-2">
            <OrderContent />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="flat" color="danger">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="bordered">View Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <div className="py-2">
          <OrderContent />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="flat" color="danger">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}