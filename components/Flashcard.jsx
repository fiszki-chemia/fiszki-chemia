export default function Flashcard({ card }) {
  return (
    <div className="p-4 my-2 bg-gray-100 rounded shadow">
      <p className="font-semibold">{card.question}</p>
      <p className="text-gray-500">{card.answer}</p>
    </div>
  )
}
