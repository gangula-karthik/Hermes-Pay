"use client"

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
// import { Button } from "@/components/ui/button";
import {Button, ButtonGroup} from "@nextui-org/button";
import { Card, CardContent } from "@/components/ui/card";
import { CameraIcon, UploadIcon, RefreshCwIcon } from 'lucide-react';
import Image from 'next/image'; // Added import for Image

export function DocumentScannerCameraComponent({ onSuccess }: { onSuccess: () => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const sendToBackend = async () => {
    if (!capturedImage) return;

    setIsSending(true);

    try {
      const response = await fetch('/api/upload_img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage, // Send base64 image data
        }),
      });

      if (response.ok) {
        alert('Document uploaded successfully!');
        onSuccess(); // Trigger the scroll to results section
        retake();
      } else {
        alert('Failed to upload document. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto"> {/* Increased size to max-w-lg */}
      <CardContent className="p-6"> {/* Slightly larger padding */}
        {capturedImage ? (
          <div className="space-y-4">
            <Image 
              src={capturedImage} 
              alt="Captured document" 
              className="w-full rounded-lg" 
              layout="responsive" 
              width={800} // Specify the width
              height={600} // Specify the height
            />
            <div className="flex justify-between">
              <Button color="danger" onClick={retake}>
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button color="success" onClick={sendToBackend} isLoading={isSending}>
                {isSending ? '' : <UploadIcon className="w-4 h-4 mr-2" />}
                Send to Backend
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
            <Button color="primary" onClick={capture} className="w-full">
              <CameraIcon className="w-4 h-4 mr-2" />
              Capture Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
