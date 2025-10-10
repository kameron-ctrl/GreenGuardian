import DiagnoseForm from '../components/DiagnoseForm';

export default function DiagnosePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-950 dark:to-emerald-950">
      {/* Header Section */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-green-100 dark:border-green-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Green Guardian
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Plant Disease Detection
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload a photo of your plant's leaf and let our AI identify potential diseases instantly.
            Get accurate diagnoses to keep your plants healthy and thriving.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-100 dark:border-green-900 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Diagnose Your Plant
            </h3>
            <p className="text-green-50 mt-2">
              Upload a clear image of the affected leaf for best results
            </p>
          </div>
          
          <div className="p-8">
            <DiagnoseForm />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-green-100 dark:border-green-900 shadow-lg">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Results</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Get AI-powered diagnoses in seconds</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-green-100 dark:border-green-900 shadow-lg">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">High Accuracy</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Advanced ML models for reliable detection</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-green-100 dark:border-green-900 shadow-lg">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy to Use</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Simple upload process, no expertise needed</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-t border-green-100 dark:border-green-900">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Green Guardian - Protecting your plants with AI technology</p>
        </div>
      </footer>
    </div>
  );
}