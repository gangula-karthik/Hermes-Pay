"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    window.addEventListener("resize", listener)
    return () => window.removeEventListener("resize", listener)
  }, [matches, query])

  return matches
}

type User = {
  id: number
  name: string
  email: string
  dailyBudget: number
  aiInstructions: string
}

const defaultUser: User = {
  id: 1,
  name: "Default User",
  email: "default@example.com",
  dailyBudget: 100,
  aiInstructions: "Default AI instructions"
}

const generatePlaceholderUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: 1000 + index,
    name: `Placeholder User ${index + 1}`,
    email: `placeholder${index + 1}@example.com`,
    dailyBudget: 0,
    aiInstructions: "No instructions set"
  }))
}

export default function UserEditor({ users }: { users?: User[] }) {
  const [userList, setUserList] = useState<User[]>(() => {
    const initialUsers = users || [defaultUser]
    const placeholderCount = Math.max(0, 9 - initialUsers.length)
    return [...initialUsers, ...generatePlaceholderUsers(placeholderCount)]
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsOpen(true)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedUser) {
      setUserList(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        )
      )
    }
    console.log("Form submitted:", selectedUser)
    setIsOpen(false)
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  const EditContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={selectedUser?.email}
          readOnly
          className="bg-muted"
        />
      </div>
      <div>
        <Label htmlFor="dailyBudget">Daily Budget</Label>
        <Input
          id="dailyBudget"
          type="number"
          value={selectedUser?.dailyBudget}
          onChange={(e) =>
            setSelectedUser((prev) =>
              prev ? { ...prev, dailyBudget: Number(e.target.value) } : null
            )
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="aiInstructions">AI Instructions</Label>
        <Textarea
          id="aiInstructions"
          value={selectedUser?.aiInstructions}
          onChange={(e) =>
            setSelectedUser((prev) =>
              prev ? { ...prev, aiInstructions: e.target.value } : null
            )
          }
          required
        />
      </div>
    </form>
  )

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {userList.slice(0, 9).map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">Daily Budget: ${user.dailyBudget}</p>
                <p className="text-sm text-muted-foreground truncate">
                  AI Instructions: {user.aiInstructions}
                </p>
              </div>
              {isDesktop ? (
                <Dialog open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setIsOpen(false)}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleEdit(user)} className="w-full">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
                      <DialogDescription>
                        Update the user's daily budget and AI instructions.
                      </DialogDescription>
                    </DialogHeader>
                    <EditContent />
                    <DialogFooter>
                      <Button type="submit" form="edit-form">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setIsOpen(false)}>
                  <DrawerTrigger asChild>
                    <Button onClick={() => handleEdit(user)} className="w-full">Edit</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Edit User: {selectedUser?.name}</DrawerTitle>
                      <DrawerDescription>
                        Update the user's daily budget and AI instructions.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                      <EditContent />
                    </div>
                    <DrawerFooter>
                      <Button type="submit" form="edit-form">
                        Save Changes
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}