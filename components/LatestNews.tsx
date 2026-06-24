'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import NewsCard from './NewsCard'

interface News {
  id: string
  title: string
  image_url: string | null
  created_at: string
}

export default function LatestNews() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestNews()
  }, [])

  async function fetchLatestNews() {
    try {
      const { data, error } = await supabase
        .rpc('get_latest_news', { limit_count: 10 })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liq-accent"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          id={item.id}
          title={item.title}
          image_url={item.image_url}
          created_at={item.created_at}
        />
      ))}
    </div>
  )
}
