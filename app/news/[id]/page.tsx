import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface NewsDetailPageProps {
  params: { id: string }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { data: news, error } = await supabase
    .from('news')
    .select('*, profiles(username)')
    .eq('id', params.id)
    .single()

  if (error || !news) {
    notFound()
  }

  const date = new Date(news.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-liq-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/" 
          className="text-liq-accent hover:text-yellow-400 mb-6 inline-flex items-center"
        >
          ← Back to Home
        </Link>

        <article className="bg-liq-card rounded-lg overflow-hidden">
          {news.image_url && (
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {news.title}
            </h1>
            
            <div className="flex items-center text-gray-400 text-sm mb-8 space-x-4">
              <span>By {news.profiles?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{date}</span>
            </div>

            <div className="prose prose-invert max-w-none">
              {news.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-300 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
