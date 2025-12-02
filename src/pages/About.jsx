export default function About() {
  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-20">

      <div className="max-w-5xl mx-auto space-y-12">

        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-blue-600 font-semibold uppercase text-sm">
            About this product
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            A modern API workspace for developers
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This tool is built to simplify how developers test, manage,
            and organize API workflows with a clean, scalable architecture.
          </p>
        </header>

        {/* MISSION */}
        <Section title="Our mission">
          To provide a minimal yet powerful environment for API testing—focusing
          on speed, clarity, and control.
        </Section>

        {/* HOW IT WORKS */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Why this exists">
            Developers don’t need heavy tools for simple workflows.
            This app focuses on clarity, fast testing, and logical organization.
          </Card>

          <Card title="Designed for productivity">
            Built using modern UI patterns, environment switching,
            and request grouping to keep testing efficient.
          </Card>
        </div>

        {/* ARCHITECTURE */}
        <Section title="How it's built">
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Frontend with React + Tailwind</li>
            <li>Backend via Express proxying</li>
            <li>Supabase for authentication & storage</li>
            <li>Monaco Editor for JSON editing</li>
          </ul>
        </Section>

        {/* VALUES */}
        <div className="grid md:grid-cols-3 gap-6">
          <Value title="Security">
            Token-based authentication and request isolation.
          </Value>

          <Value title="Speed">
            Lightweight design and fast response handling.
          </Value>

          <Value title="Usability">
            Clean UI, dark mode, smart layouts.
          </Value>
        </div>

        {/* CLOSE */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Built as a production-style project to demonstrate
          full-stack engineering and real-world system design.
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-slate-100 dark:bg-gray-800 p-5 rounded-xl shadow">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  );
}

function Value({ title, children }) {
  return (
    <div className="bg-slate-100  dark:bg-gray-800 p-5 rounded-xl shadow text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{children}</p>
    </div>
  );
}
