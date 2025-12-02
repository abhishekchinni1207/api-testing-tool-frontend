import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            API Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
            Build. Test. Deliver APIs faster.
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            A lightweight API workspace for developing, testing, and organizing
            requests with collections, environments and history.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to="/app"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-medium"
            >
              Open App
            </Link>

            <Link
              to="/about"
              className="border border-gray-300 dark:border-gray-600
                         px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* FEATURE PREVIEW */}
        <div className="bg-slate-100 dark:bg-gray-800 rounded-2xl p-6 shadow space-y-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">What you can do</div>
          <ul className="space-y-2 text-sm">
            <li>• Send API requests via proxy</li>
            <li>• Store requests & history</li>
            <li>• Use environments</li>
            <li>• JSON editing with Monaco</li>
            <li>• Secure login</li>
            <li>• Dark mode support</li>
          </ul>
        </div>
      </section>

      {/* TRUST / VALUE */}
      <section className="bg-slate-50 dark:bg-gray-800 py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Stat title="Fast Setup" value="1 min" />
          <Stat title="Auth Ready" value="Supabase" />
          <Stat title="Proxy Layer" value="Yes" />
          <Stat title="History + Folders" value="Built-in" />
        </div>
      </section>

      {/* DEVELOPER TOOLS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-8">Built for developers</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Feature title="Request Proxying">
            Avoid browser CORS limits by routing requests through the backend.
          </Feature>

          <Feature title="Smart Collections">
            Save and organize calls into folders for reuse.
          </Feature>

          <Feature title="Environment Variables">
            Use {`{base_url}`} & secrets across environments.
          </Feature>

          <Feature title="Request History">
            Track every call for debugging and reuse.
          </Feature>

          <Feature title="Monaco JSON Editor">
            Syntax highlight + formatting.
          </Feature>

          <Feature title="Authentication">
            Sign in & keep data private.
          </Feature>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16 text-center">
        <h2 className="text-2xl font-bold">Start testing APIs in seconds</h2>
        <p className="mt-2 opacity-90">No installation. No setup.</p>

        <Link
          to="/app"
          className="inline-block mt-6 bg-white text-blue-700 font-semibold px-7 py-3 rounded-lg hover:bg-gray-200"
        >
          Launch App
        </Link>
      </section>

      <footer className="text-center text-xs py-6 dark:text-gray-400 text-gray-500">
        API Testing Tool • Built with React & Supabase
      </footer>
    </div>
  );
}

function Feature({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
}
