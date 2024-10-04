'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from "@/components/ui/label"
import {Input} from "@nextui-org/input";
import {Tooltip} from "@nextui-org/tooltip";
import {Button} from "@nextui-org/button";
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Check, UserPlus } from "lucide-react"

type FamilyMember = {
  email: string
  verified: boolean
}

export function FamilyManager() {
  const [email, setEmail] = useState('')
  const [family, setFamily] = useState<FamilyMember[]>([{ email: 'demo@gmail.com', verified: true }]) // Added default value
  const [error, setError] = useState('')

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const addFamilyMember = () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (family.some(member => member.email === email)) {
      setError('This email is already in your family list')
      return
    }
    setFamily([...family, { email, verified: false }])
    setEmail('')
    setError('')
  }

  const verifyMember = (email: string) => {
    setFamily(family.map(member => 
      member.email === email ? { ...member, verified: true } : member
    ))
  }

  const removeMember = (email: string) => {
    setFamily(family.filter(member => member.email !== email))
  }

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  const truncateEmail = (email: string, maxLength: number) => {
    if (email.length <= maxLength) return email
    const [name, domain] = email.split('@')
    const truncatedName = name.slice(0, maxLength - domain.length - 3) // -3 for '@' and '..'
    return `${truncatedName}..@${domain}`
  }

  return (
    <Card className="w-full max-w-xl mx-auto mt-10 overflow-auto">
      <CardContent className="p-6">
        <motion.h2 
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Family Manager
        </motion.h2>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Label htmlFor="email" className="text-lg mb-2 block">Add Family Member</Label>
            <div className="flex space-x-2 items-center">
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="text-lg py-2"
              />
              <Button color="primary" onClick={addFamilyMember} className="px-4 whitespace-nowrap">
                <UserPlus/>
                Add
              </Button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p 
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="space-y-4 overflow-auto max-h-96">
            <AnimatePresence>
              {family.map((member) => (
                <motion.div
                  key={member.email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback>{getInitials(member.email)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Tooltip color="primary" content={member.email}>
                            <p className="text-base font-medium truncate" title={member.email}>
                              {truncateEmail(member.email, 20)}
                            </p>
                          </Tooltip>
                          <motion.p 
                            className="text-xs text-muted-foreground"
                            initial={false}
                            animate={{ color: member.verified ? '#10B981' : '#6B7280' }}
                            transition={{ duration: 0.3 }}
                          >
                            {member.verified ? 'Verified' : 'Pending verification'}
                          </motion.p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <AnimatePresence>
                          {!member.verified && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                onClick={() => verifyMember(member.email)}
                                color="success"
                                size="sm"
                                variant="flat"
                              >Verify</Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <Button
                          onClick={() => removeMember(member.email)}
                          color="danger"
                          size="sm"
                          variant="flat"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}