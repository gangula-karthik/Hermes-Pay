"use client"

import { useState } from "react"
import { useSprings, animated, to as interpolate } from "@react-spring/web"
import { useDrag } from "react-use-gesture"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface FoodItem {
  id: string
  name: string
  price: number
  image: string
}

const foodItems: FoodItem[] = [
  { id: "1", name: "Burger", price: 9.99, image: "/placeholder.svg?height=300&width=300" },
  { id: "2", name: "Pizza", price: 12.99, image: "/placeholder.svg?height=300&width=300" },
  { id: "3", name: "Salad", price: 7.99, image: "/placeholder.svg?height=300&width=300" },
  { id: "4", name: "Sushi", price: 15.99, image: "/placeholder.svg?height=300&width=300" },
  { id: "5", name: "Pasta", price: 11.99, image: "/placeholder.svg?height=300&width=300" },
]

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function useStack(items: FoodItem[], onSwipe: (id: string, direction: 'left' | 'right') => void) {
  const [gone] = useState(() => new Set())
  const [props, api] = useSprings(items.length, i => ({
    ...to(i),
    from: from(i),
  }))

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2
    const dir = xDir < 0 ? -1 : 1
    if (!down && trigger) {
      gone.add(index)
      onSwipe(items[index].id, dir === 1 ? 'right' : 'left')
    }
    api.start(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0)
      const scale = down ? 1.1 : 1
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      }
    })
    if (!down && gone.size === items.length)
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      }, 600)
  })

  return [props, bind] as const
}

export function SwipeableFoodStackComponent() {
  const [chosenItems, setChosenItems] = useState<string[]>([])
  const [rejectedItems, setRejectedItems] = useState<string[]>([])

  const onSwipe = (id: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      setChosenItems(prev => [...prev, id])
    } else {
      setRejectedItems(prev => [...prev, id])
    }
  }

  const [props, bind] = useStack(foodItems, onSwipe)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="relative h-[60vh] flex items-center justify-center mb-8">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div className="absolute w-80 h-96 will-change-transform" key={i} style={{ x, y }}>
            <animated.div
              {...bind(i)}
              style={{
                transform: interpolate([rot, scale], trans),
                touchAction: 'none',
              }}
            >
              <Card className="w-full h-full bg-white shadow-xl rounded-xl overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative h-3/4 w-full">
                    <Image
                      src={foodItems[i].image}
                      alt={foodItems[i].name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <animated.div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: x.to({ range: [-100, 0, 100], output: [1, 0, 1] }),
                        backgroundColor: x.to({ range: [-100, 0, 100], output: ['rgba(255,0,0,0.3)', 'rgba(0,0,0,0)', 'rgba(0,255,0,0.3)'] }),
                      }}
                    >
                      {x.to(x => {
                        if (x < -50) return <Badge className="text-2xl p-2">Reject</Badge>
                        if (x > 50) return <Badge className="text-2xl p-2">Choose</Badge>
                        return null
                      })}
                    </animated.div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="text-xl font-semibold">{foodItems[i].name}</h3>
                    <p className="text-lg text-muted-foreground">${foodItems[i].price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            </animated.div>
          </animated.div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Chosen Items</h2>
          <ul className="list-disc pl-5">
            {chosenItems.map(id => {
              const item = foodItems.find(food => food.id === id)
              return item ? <li key={id}>{item.name}</li> : null
            })}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Rejected Items</h2>
          <ul className="list-disc pl-5">
            {rejectedItems.map(id => {
              const item = foodItems.find(food => food.id === id)
              return item ? <li key={id}>{item.name}</li> : null
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}