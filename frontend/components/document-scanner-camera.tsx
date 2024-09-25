"use client"

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CameraIcon, UploadIcon, RefreshCwIcon } from 'lucide-react';

export function DocumentScannerCameraComponent() {
  const webcamRef = useRef<Webcam>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
    }
  }, [webcamRef])

  const retake = () => {
    setCapturedImage(null)
  }

  const sendToBackend = async () => {
    if (!capturedImage) return

    setIsSending(true)
    try {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage }),
      })

      if (response.ok) {
        alert('Document uploaded successfully!')
        retake()
      } else {
        throw new Error('Failed to upload document')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        {capturedImage ? (
          <div className="space-y-4">
            <img src={capturedImage} alt="Captured document" className="w-full rounded-lg" />
            <div className="flex justify-between">
              <Button onClick={retake} variant="outline">
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button onClick={sendToBackend} disabled={isSending}>
                <UploadIcon className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send to Backend'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment"
              }}
              className="w-full rounded-lg"
            />
            <Button onClick={capture} className="w-full">
              <CameraIcon className="w-4 h-4 mr-2" />
              Capture Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}