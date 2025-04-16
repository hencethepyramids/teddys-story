"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AdjustableImage } from "./components/AdjustableImage"

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const totalPages = 5

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 500)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 500)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage()
      if (e.key === "ArrowLeft") prevPage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage])

  return (
    <main className="h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      {/* Book Cover (shown when on page 0) */}
      {currentPage === 0 ? (
        <div
          className={cn(
            "w-full max-w-3xl h-[85vh] bg-amber-800 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2),15px_15px_0_0_#92400e,-15px_15px_0_0_#92400e]",
            "flex flex-col items-center justify-center text-center p-8 relative overflow-hidden",
            "border-r-[25px] border-r-amber-900 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[25px] before:bg-amber-900",
            isFlipping ? "animate-book-close" : "",
          )}
        >
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=600')] opacity-20 bg-cover bg-center"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-8 border-4 border-amber-200 shadow-lg">
              <AdjustableImage
                src="/images/IMG_9313.JPG"
                alt="Your beloved dog"
                width={160}
                height={160}
                className="object-cover"
                priority
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-100 mb-6">In Loving Memory</h1>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-amber-200 mb-4">A Beautiful Soul</h2>
            <p className="text-amber-300 mb-8 text-xl">A Treasured Life</p>
            <p className="max-w-lg text-amber-200 mb-12 italic text-lg">
              "The memories we keep in our hearts are the treasures that time cannot steal."
            </p>
            <Button onClick={nextPage} className="bg-amber-600 hover:bg-amber-700 text-lg px-6 py-6 h-auto font-serif">
              Open Book
            </Button>
          </div>
        </div>
      ) : (
        // Book Pages
        <div className="relative w-full max-w-5xl">
          {/* Navigation Controls */}
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 z-20">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 z-20">
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Book Spread */}
          <div
            className={cn(
              "flex w-full bg-white rounded-lg overflow-hidden",
              "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)]",
              "border-b-8 border-amber-800",
              isFlipping ? "animate-page-turn" : "",
            )}
          >
            {/* Left Page */}
            <div className="w-1/2 min-h-[600px] bg-amber-50 p-8 border-r border-amber-200 relative">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=10&width=10&text=')] opacity-5"></div>
              <div className="relative z-10">{renderLeftPage(currentPage)}</div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-amber-800 font-serif">
                {currentPage * 2 - 1}
              </div>
            </div>

            {/* Right Page */}
            <div className="w-1/2 min-h-[600px] bg-amber-50 p-8 relative">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=10&width=10&text=')] opacity-5"></div>
              <div className="relative z-10">{renderRightPage(currentPage)}</div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-amber-800 font-serif">
                {currentPage * 2}
              </div>
            </div>
          </div>

          {/* Page Count */}
          <div className="text-center mt-4 text-amber-800 font-serif">
            Page {currentPage} of {totalPages - 1}
          </div>
        </div>
      )}
    </main>
  )
}

function renderLeftPage(pageNum: number) {
  switch (pageNum) {
    case 1:
      return (
        <div className="h-full flex flex-col">
          <h2 className="text-3xl font-serif text-amber-800 mb-6 text-center">About</h2>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-amber-200 shadow-md mx-auto">
              <AdjustableImage
                src="/images/IMG_8895.JPG"
                alt="A happy moment"
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-serif text-amber-700 mb-2 text-center">Forever in Our Hearts</h3>
            <p className="text-amber-600 text-center mb-4">A Lifetime of Love and Joy</p>
            <div className="w-16 h-1 bg-amber-300 mb-4"></div>
            <p className="text-amber-800 text-center italic">
              "A loyal companion, a faithful friend, and a beloved family member."
            </p>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="h-full">
          <h2 className="text-3xl font-serif text-amber-800 mb-6 text-center">Favorite Memories</h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow-md border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-1">First Day Home</h3>
              <p className="text-amber-800 text-sm">
                The day we brought you home, you were so tiny and curious. You explored every corner of the house with
                such enthusiasm.
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow-md border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-1">Beach Adventures</h3>
              <p className="text-amber-800 text-sm">
                You loved the beach more than anything. The way you'd run through the waves and dig in the sand brought
                us so much joy.
              </p>
            </div>
            <div className="bg-white p-4 rounded shadow-md border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-1">Morning Cuddles</h3>
              <p className="text-amber-800 text-sm">
                Every morning, you'd jump on the bed for cuddles. No alarm clock was ever as effective or as welcome.
              </p>
            </div>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="h-full">
          <h2 className="text-3xl font-serif text-amber-800 mb-6 text-center">Photo Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-md overflow-hidden shadow-md border-2 border-amber-200"
              >
                <AdjustableImage
                  src={`/placeholder.svg?height=200&width=200&text=Photo ${i + 1}`}
                  alt={`Memory ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )
    case 4:
      return (
        <div className="h-full">
          <h2 className="text-3xl font-serif text-amber-800 mb-6 text-center">Your Legacy</h2>
          <div className="space-y-6">
            <p className="text-amber-800">
              You taught us about unconditional love, loyalty, and living in the moment. Your spirit lives on in every
              smile your memory brings.
            </p>
            <p className="text-amber-800">
              Though you're no longer by our side, the paw prints you left on our hearts will remain forever.
            </p>
            <div className="flex justify-center mt-6">
              <div className="w-24 h-24 relative">
                <AdjustableImage
                  src="/placeholder.svg?height=100&width=100&text=Paw"
                  alt="Paw print"
                  width={96}
                  height={96}
                  className="opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
      )
    default:
      return <div></div>
  }
}

function renderRightPage(pageNum: number) {
  switch (pageNum) {
    case 1:
      return (
        <div className="h-full grid grid-cols-2 gap-4">
          <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
            <AdjustableImage
              src="/images/IMG_3636.JPG"
              alt="Relaxing on the couch"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
            <AdjustableImage
              src="/images/IMG_5010.HEIC"
              alt="Playing in the snow"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
            <AdjustableImage
              src="/images/IMG_8006.JPG"
              alt="Family moments"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
            <AdjustableImage
              src="/images/IMG_9265.JPG"
              alt="Happy smile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )
    case 2:
      return (
        <div className="h-full">
          <h2 className="text-3xl font-serif text-amber-800 mb-6 text-center">Special Moments</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
              <AdjustableImage
                src="/images/IMG_8931.JPG"
                alt="On a walk"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
              <AdjustableImage
                src="/images/IMG_8754.JPG"
                alt="By the lake"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-amber-800 text-center mt-6 italic">
            "Every walk was an adventure, every moment a treasure."
          </p>
        </div>
      )
    case 3:
      return (
        <div className="h-full">
          <h2 className="text-3xl font-serif text-amber-800 mb-6 text-center">Cherished Times</h2>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-md mb-6">
            <AdjustableImage
              src="/images/IMG_8668.JPG"
              alt="Autumn adventures"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-amber-800 text-center italic">
            "Your love made every season beautiful."
          </p>
        </div>
      )
    default:
      return null
  }
}
