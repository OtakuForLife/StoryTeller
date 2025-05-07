import Navbar from '@/components/Navbar'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div className="bg-skin-primary h-screen w-screen">
      <Navbar />
      <div className="text-skin-primary max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to StoryTeller</h1>
          <p className="text-xl text-skin-primary">
            A tool for designing stories and their components and finally guiding the process of writing a book.
          </p>
        </div>

        <div className="text-skin-primary grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create Stories</h2>
            <p className="mb-4">
              Develop your story ideas with our intuitive interface. Organize your thoughts and build compelling narratives.
            </p>
            <Link to="/login" className="hover:underline">Get Started →</Link>
          </div>

          <div className="text-skin-primary p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Develop Characters</h2>
            <p className="mb-4">
              Create rich, detailed characters with backgrounds, motivations, and arcs that drive your story forward.
            </p>
            <Link to="/login" className="hover:underline">Get Started →</Link>
          </div>

          <div className="text-skin-primary p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Write Chapters</h2>
            <p className="mb-4">
              Organize your book into chapters, write content, and track your progress as you build your masterpiece.
            </p>
            <Link to="/login" className="hover:underline">Get Started →</Link>
          </div>

          <div className="text-skin-primary p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Track Progress</h2>
            <p className="mb-4">
              Monitor your writing journey, set goals, and celebrate milestones as you complete your book.
            </p>
            <Link to="/login" className="hover:underline">Get Started →</Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/register"
            className="px-6 py-3 rounded-md font-medium bg-skin-secondary text-skin-primary hover:bg-skin-primary-hover transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
