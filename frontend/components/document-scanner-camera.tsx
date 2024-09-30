import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/react";
import { Card, CardContent } from "@/components/ui/card";
import { CameraIcon, UploadIcon, RefreshCwIcon } from 'lucide-react';
import Image from 'next/image';

export function DocumentScannerCameraComponent({ onSuccess, setFoodItems }: { onSuccess: () => void, setFoodItems: (items: any) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false); // New state to track camera readiness
  const [loadingCamera, setLoadingCamera] = useState(true); // State to manage the spinner

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
      const response = await fetch('http://localhost:5000/mock/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage, // Send base64 image data
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Get the OCR result as a JSON object
        setFoodItems(data); // Update the food items in the parent component
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

  const handleCameraReady = () => {
    setIsCameraReady(true);
    setLoadingCamera(false); // Stop the spinner when the camera is ready
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        {capturedImage ? (
          <div className="space-y-4">
            <Image
              src={capturedImage}
              alt="Captured document"
              className="w-full rounded-lg"
              layout="responsive"
              width={800}
              height={600}
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
            {loadingCamera && (
              <div className="flex justify-center items-center">
                <Spinner size="lg" />
              </div>
            )}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment"
              }}
              onUserMedia={handleCameraReady} // This fires when the camera is ready
              className={`w-full rounded-lg ${loadingCamera ? 'hidden' : ''}`} // Hide the webcam until it's ready
            />
            <Button
              color="primary"
              onClick={capture}
              className="w-full"
              disabled={!isCameraReady} // Disable the button until the camera is ready
              isLoading={loadingCamera} // Set isLoading on the button while the camera is getting ready
            >
              {loadingCamera ? '' : <CameraIcon className="w-4 h-4 mr-2" />}
              Capture Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
