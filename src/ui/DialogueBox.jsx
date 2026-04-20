import { useEffect, useState } from "react"

export default function DialogueBox({ text, onComplete }) {
  const [display, setDisplay] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplay((prev) => prev + text[index])
        setIndex(index + 1)
      }, 30)

      return () => clearTimeout(timeout)
    } else {
      onComplete && onComplete()
    }
  }, [index, text, onComplete])

  return (
    <div className="bg-black bg-opacity-80 border border-purple-500 p-6 rounded-xl w-150 text-white">
      <p>{display}</p>
    </div>
  )
}