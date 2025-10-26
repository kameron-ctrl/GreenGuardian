import DiagnoseForm from "../components/DiagnoseForm";
import SpotlightCard from "../components/SpotlightCard";

export default function DiagnosePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
        style={{ backgroundImage: "url(/background3.jpg)" }}
      ></div>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* All content wrapped in relative container for z-index control */}
      <div className="relative z-10">
        <header className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-md border-b border-white/20 dark:border-green-900/30 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                Green Guardian
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Diagnose Plant Diseases with AI
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Upload a photo of your plant&apos;s leaf and let our AI identify
              potential diseases instantly. Get accurate diagnoses to keep your
              plants healthy and thriving.
            </p>
          </div>

          <SpotlightCard className="max-w-5xl w-full mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 dark:border-green-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-3xl">
              <h3 className="text-2xl font-semibold text-white">
                Diagnose Your Plant
              </h3>
              <p className="text-green-50 mt-2">
                Upload a clear image of the affected leaf for best results
              </p>
            </div>

            <div className="p-8">
              <DiagnoseForm />
            </div>
          </SpotlightCard>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <SpotlightCard className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 drop-shadow-md">
                Instant Results
              </h4>
              <p className="text-white/80 text-sm drop-shadow-sm">
                Get AI-powered diagnoses in seconds
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 drop-shadow-md">
                High Accuracy
              </h4>
              <p className="text-white/80 text-sm drop-shadow-sm">
                Advanced ML models for reliable detection
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 drop-shadow-md">
                Easy to Use
              </h4>
              <p className="text-white/80 text-sm drop-shadow-sm">
                Simple upload process, no expertise needed
              </p>
            </SpotlightCard>
          </div>
        </main>

        <footer className="mt-20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-md border-t border-white/20 dark:border-green-900/30">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-white/80 text-sm drop-shadow-md">
            <p>Green Guardian - Protecting your plants with AI technology</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
