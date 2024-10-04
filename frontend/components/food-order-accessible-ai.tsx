"use client"

import { useState, useEffect } from "react"
import { Button } from "@nextui-org/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Volume2 } from "lucide-react"

type FoodItem = {
  name: string;
  image: string;
  price: string;
};

type FoodOrderAccessibleAiProps = {
  foodOrder: FoodItem[];
};

export function FoodOrderAccessibleAi({ foodOrder }: FoodOrderAccessibleAiProps) {
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

  const totalPrice = foodOrder.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2)

  // Generate a simple AI recommendation based on the order
  const generateAiRecommendation = () => {
    const itemCount = foodOrder.length;
    if (itemCount === 0) return "Your order is empty. How about adding some delicious items?";
    if (itemCount === 1) return `Great start with the ${foodOrder[0].name}! Consider adding a side or drink to complete your meal.`;
    return `Excellent choices! Your order of ${itemCount} items looks balanced. Enjoy your meal!`;
  }

  const aiRecommendation = generateAiRecommendation();

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
          {foodOrder.map((item, index) => (
            <div key={index} className="flex justify-between text-lg">
              <span>{item.name}</span>
              <span>{item.price}</span>
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