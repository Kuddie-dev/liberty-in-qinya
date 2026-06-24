'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NewsCard from '@/components/NewsCard'
import SearchBar from '@/components/SearchBar'

interface News {
  id: string
  title: string
  image_url: string | null
  created_at: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<News[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query])

  async function performSearch() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .rpc('search_news', { search_query: query })

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">
        Searching for "{query}"
      </h1>
      <p className="text-gray-400 mb-8">
        {results.length} result{results.length !== 1 ? 's' : ''} found
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liq-accent"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              image_url={item.image_url}
              created_at={item.created_at}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No news found matching your search.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-liq-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SearchBar />
      </div>
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liq-accent"></div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  )
}
