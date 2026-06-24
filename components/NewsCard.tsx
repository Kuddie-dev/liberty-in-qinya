import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  id: string
  title: string
  image_url: string | null
  created_at: string
}

export default function NewsCard({ id, title, image_url, created_at }: NewsCardProps) {
  const date = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Link href={`/news/${id}`} className="group block">
      <div className="bg-liq-card rounded-lg overflow-hidden hover:ring-2 hover:ring-liq-accent transition-all duration-300">
        <div className="relative h-48 w-full bg-gray-800">
          {image_url ? (
            <Image
              src={image_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-liq-accent transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mt-2">{date}</p>
        </div>
      </div>
    </Link>
  )
}
