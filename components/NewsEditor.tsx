'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface NewsEditorProps {
  newsId?: string
  initialTitle?: string
  initialContent?: string
  initialImageUrl?: string | null
}

export default function NewsEditor({ 
  newsId, 
  initialTitle = '', 
  initialContent = '',
  initialImageUrl = null 
}: NewsEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [imageUrl, setImageUrl] = useState(initialImageUrl)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('news-media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('news-media')
        .getPublicUrl(filePath)

      setImageUrl(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required!')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in!')
        return
      }

      if (newsId) {
        // Update existing news
        const { error } = await supabase
          .from('news')
          .update({ title, content, image_url: imageUrl })
          .eq('id', newsId)

        if (error) throw error
      } else {
        // Create new news
        const { error } = await supabase
          .from('news')
          .insert([{ title, content, image_url: imageUrl, author_id: user.id }])

        if (error) throw error
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error saving news:', error)
      alert('Failed to save news')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!newsId) return
    if (!confirm('Are you sure you want to delete this news?')) return

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId)

      if (error) throw error
      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Failed to delete news')
    }
  }

  return (
    <div className="bg-liq-card rounded-lg p-6 space-y-6">
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Insert Image / Upload Image
        </label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-liq-accent transition-colors"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="max-h-64 mx-auto rounded" />
          ) : (
            <div className="text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Click to upload image</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {uploading && <p className="text-liq-accent mt-2">Uploading...</p>}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter news title..."
          className="w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-liq-accent"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your news content here..."
          rows={12}
          className="w-full bg-black border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-liq-accent resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-liq-accent hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : (newsId ? 'Update News' : 'Publish News')}
        </button>
        
        {newsId && (
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
