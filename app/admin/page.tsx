'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminGuard from '@/components/AdminGuard'
import NewsEditor from '@/components/NewsEditor'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'

interface News {
  id: string
  title: string
  image_url: string | null
  created_at: string
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}

function AdminDashboard() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)

  useEffect(() => {
    fetchAllNews()
  }, [])

  async function fetchAllNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, image_url, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(newsItem: News) {
    setEditingNews(newsItem)
    setShowEditor(true)
  }

  function handleNew() {
    setEditingNews(null)
    setShowEditor(true)
  }

  function handleCloseEditor() {
    setShowEditor(false)
    setEditingNews(null)
    fetchAllNews()
  }

  return (
    <div className="min-h-screen bg-liq-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">News Editor</h1>
          <button
            onClick={handleNew}
            className="bg-liq-accent hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition"
          >
            + Create New News
          </button>
        </div>

        {showEditor && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingNews ? 'Edit News' : 'Create New News'}
              </h2>
              <button
                onClick={handleCloseEditor}
                className="text-gray-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <NewsEditor
              newsId={editingNews?.id}
              initialTitle={editingNews?.title}
            />
          </div>
        )}

        <h2 className="text-xl font-semibold text-white mb-6">All News</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liq-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {news.map((item) => (
              <div key={item.id} className="relative group">
                <Link href={`/news/${item.id}`}>
                  <NewsCard
                    id={item.id}
                    title={item.title}
                    image_url={item.image_url}
                    created_at={item.created_at}
                  />
                </Link>
                <button
                  onClick={() => handleEdit(item)}
                  className="absolute top-2 right-2 bg-liq-accent text-black px-3 py-1 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
