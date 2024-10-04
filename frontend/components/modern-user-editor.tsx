'use client'

import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { motion, AnimatePresence } from 'framer-motion'
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PencilIcon, DollarSign, FileText, Users, User } from 'lucide-react'

interface UserData {
  id: number;
  email: string;
  name: string;
  dailyBudget: number;
  instructions: string;
}

export function ModernUserEditor() {
  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      email: 'demo@gmail.com',
      name: 'Demo User',
      dailyBudget: 50,
      instructions: 'Default instructions for Demo User'
    }
  ])

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedUser) {
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === selectedUser.id 
          ? {
              ...user,
              dailyBudget: Number(formData.get('dailyBudget')),
              instructions: formData.get('instructions') as string
            }
          : user
      ))
    }
    setIsOpen(false)
  }

  const EditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="dailyBudget">Daily Budget</Label>
        <div className="relative mt-1">
          {/* <Input
            id="dailyBudget"
            name="dailyBudget"
            type="number"
            placeholder={selectedUser?.dailyBudget.toString()}
            className="pl-8"
            required
            startContent={
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            }
          /> */}
                  <Input
          type="number"
          variant="bordered"
          placeholder={selectedUser?.dailyBudget.toString()}
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
        />
        </div>
      </div>
      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <div className="relative mt-1">
          <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
          <Textarea
            id="instructions"
            name="instructions"
            defaultValue={selectedUser?.instructions}
            className="pl-8 min-h-[100px]"
            required
          />
        </div>
      </div>
      <Button color="primary" variant="solid" type="submit" className="w-full">Update</Button>
    </form>
  )

  const UserCard = ({ user }: { user: UserData }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">{user.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {isMobile ? (
              <Drawer open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                setIsOpen(open)
                if (open) setSelectedUser(user)
              }}>
                <DrawerTrigger asChild>
                  <Button color="primary" variant="solid" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Edit User Information</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <EditForm />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                setIsOpen(open)
                if (open) setSelectedUser(user)
              }}>
                <DialogTrigger asChild>
                  <Button color="primary" variant="solid" size="sm">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User Information</DialogTitle>
                  </DialogHeader>
                  <EditForm />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs sm:text-sm font-medium">Daily Budget</p>
                <p className="text-lg sm:text-2xl font-bold">${user.dailyBudget}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FileText className="text-blue-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs sm:text-sm font-medium">Instructions</p>
                <p className="text-xs sm:text-sm line-clamp-2">{user.instructions}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="p-2 sm:p-4 max-w-4xl mx-auto">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <AnimatePresence>
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}