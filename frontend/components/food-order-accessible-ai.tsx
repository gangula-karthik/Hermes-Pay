"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, Loader2 } from "lucide-react";

type FoodItem = {
  name: string;
  image: string;
  price: string; // Removed image from the type definition
};

type FoodOrderAccessibleAiProps = {
  foodOrder: FoodItem[];
  menu: FoodItem[];
};

export function FoodOrderAccessibleAi({
  foodOrder,
  menu,
}: FoodOrderAccessibleAiProps) {
  const router = useRouter(); // Initialize the router

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const totalPrice = foodOrder
    .reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0)
    .toFixed(2);

  const fetchRecommendation = async () => {
    setIsPayLoading(true); // Start loading for "Pay" buttons

    try {
      const response = await fetch("https://5bbc-121-6-124-133.ngrok-free.app/recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'ngrok-skip-browser-warning': '69420'
        },
        body: JSON.stringify({
          totalPrice: totalPrice,
          foodOrder: foodOrder.map(({ image, ...rest }) => rest), // Removed image from foodOrder
          menu: menu.map(({ image, ...rest }) => rest), // Removed image from menu
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      const data = await response.json();
      console.log(data); // Log the API output
      setAiRecommendation(data.analysis);
    } catch (error) {
      setAiRecommendation(
        "We're having trouble generating a recommendation right now. Please wait for a few seconds."
      );
    } finally {
      setIsPayLoading(false); // Stop loading for "Pay" buttons after API completes
    }
  };

  const handleViewOrder = async () => {
    setIsLoading(true);
    await fetchRecommendation();
    setIsLoading(false);
    setIsOpen(true); // Open the drawer/dialog after loading completes
  };

  const speakRecommendation = () => {
    const utterance = new SpeechSynthesisUtterance(aiRecommendation);
    speechSynthesis.speak(utterance);
  };

  const handlePayment = () => {
    setIsPayLoading(true); // Optional: Show loading state
    setTimeout(() => {
      window.alert("Your order has been placed successfully!"); // Show an alert

      router.push("/dashboard/order"); // Redirect to /dashboard/order after the alert is dismissed
    }, 1000); // Simulate API delay before showing the alert and redirect
  };

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
        <Button color="primary" isLoading={isPayLoading} onClick={handlePayment}>
          Pay Now 📱
        </Button>
        <Button color="secondary" isLoading={isPayLoading} onClick={handlePayment}>
          Cash Pay 💵
        </Button>
      </div>
    </>
  );

  const ViewOrderButton = () => (
    <Button variant="bordered" onClick={handleViewOrder} isLoading={isLoading}>
      View Order
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <ViewOrderButton />
        </DrawerTrigger>
        <DrawerContent>
          <div className="px-4 py-2">
            <OrderContent />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="flat" color="danger">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ViewOrderButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <div className="py-2">
          <OrderContent />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="flat" color="danger">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
