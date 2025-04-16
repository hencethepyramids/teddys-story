import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactCrop, { type Crop, type PercentCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface AdjustableImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
}

export function AdjustableImage({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  className,
}: AdjustableImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  })
  const [activeTab, setActiveTab] = useState('view')
  const [imageError, setImageError] = useState(false)

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(`image-position-${src}`)
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch (e) {
        console.error('Failed to load saved position:', e)
      }
    }
  }, [src])

  const handlePositionChange = (axis: 'x' | 'y', value: number[]) => {
    const newPosition = {
      ...position,
      [axis]: value[0]
    }
    setPosition(newPosition)
    try {
      localStorage.setItem(`image-position-${src}`, JSON.stringify(newPosition))
    } catch (e) {
      console.error('Failed to save position:', e)
    }
  }

  const handleCropComplete = (crop: Crop) => {
    setCrop(crop)
  }

  const imageStyle = {
    objectPosition: `${position.x}% ${position.y}%`,
    objectFit: 'cover' as const,
  }

  // Handle HEIC images
  const isHeic = src.toLowerCase().endsWith('.heic')
  const imageSrc = isHeic ? src.replace(/\.heic$/i, '.jpg') : src

  const handleImageError = () => {
    setImageError(true)
    console.error('Failed to load image:', src)
  }

  const ImageComponent = isHeic ? 'img' : Image

  return (
    <>
      <div 
        className="relative cursor-pointer group" 
        onClick={() => {
          setIsOpen(true)
          setActiveTab('view')
        }}
      >
        {isHeic ? (
          <img
            src={imageSrc}
            alt={alt}
            className={`${className} object-cover w-full h-full`}
            style={imageStyle}
            onError={handleImageError}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            priority={priority}
            className={`${className} object-cover`}
            style={imageStyle}
            onError={handleImageError}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            View & Edit
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Image Editor</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="crop">Crop</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="mt-4">
              <div className="relative w-full h-[70vh]">
                {isHeic ? (
                  <img
                    src={imageSrc}
                    alt={alt}
                    className="object-contain w-full h-full"
                    style={imageStyle}
                    onError={handleImageError}
                  />
                ) : (
                  <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    className="object-contain"
                    style={imageStyle}
                    onError={handleImageError}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="position" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Horizontal Position</label>
                  <Slider
                    value={[position.x]}
                    onValueChange={(value) => handlePositionChange('x', value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Vertical Position</label>
                  <Slider
                    value={[position.y]}
                    onValueChange={(value) => handlePositionChange('y', value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="relative h-60 w-full overflow-hidden rounded-lg border">
                  {isHeic ? (
                    <img
                      src={imageSrc}
                      alt={alt}
                      className="object-cover w-full h-full"
                      style={imageStyle}
                      onError={handleImageError}
                    />
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={alt}
                      fill
                      className="object-cover"
                      style={imageStyle}
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="crop" className="mt-4">
              <div className="relative w-full" style={{ minHeight: '400px' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop: PercentCrop) => setCrop(percentCrop)}
                  onComplete={handleCropComplete}
                  aspect={undefined}
                >
                  <img
                    src={imageSrc}
                    alt={alt}
                    style={{ maxHeight: '60vh', width: 'auto', margin: '0 auto' }}
                    onError={handleImageError}
                  />
                </ReactCrop>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 })}
                >
                  Reset Crop
                </Button>
                <Button
                  onClick={() => {
                    // Here we would handle saving the crop
                    console.log('Save crop:', crop)
                  }}
                >
                  Apply Crop
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
} 