import Image from 'next/image'
import LatestNews from '@/components/LatestNews'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96">
        <Image
          src="/images/banner.jpg"
          alt="Liberty In Qinya Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-liq-dark to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Liberty In Qinya
          </h1>
          <p className="text-gray-300 text-lg">Your Trusted News Source</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar />
      </div>

      {/* Latest News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white border-l-4 border-liq-accent pl-4">
            Latest News
          </h2>
          <span className="text-gray-400 text-sm">Showing latest 10 news</span>
        </div>
        <LatestNews />
      </div>

      {/* Footer */}
      <footer className="bg-liq-card border-t border-gray-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 Liberty In Qinya Media Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
