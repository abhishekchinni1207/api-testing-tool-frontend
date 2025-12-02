import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function ResponseViewer({ response }) {
  const [showHeaders, setShowHeaders] = useState(false);

  // Empty State
  if (!response) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-gray-500 flex items-center justify-center">
        Waiting for response…
      </div>
    );
  }

  // Error State
  if (response.error) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-red-500">
        {response.error}
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-xl shadow flex flex-col">

      {/* Header */}
      <div className="mb-3 flex justify-between items-center text-sm">
        <div>
          <p><b>Status:</b> {response.status} {response.statusText}</p>
          <p><b>Time:</b> {response.time} ms</p>
        </div>

        {/* Toggle Headers */}
        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
        >
          {showHeaders ? "Hide Headers" : "Show Headers"}
        </button>
      </div>

      {/* Response Headers */}
      {showHeaders && (
        <div className="mb-3 max-h-[160px] overflow-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
          {Object.entries(response.headers || {}).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between text-xs border-b py-1 gap-4"
            >
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {key}
              </span>
              <span className="font-mono text-gray-700 dark:text-gray-300 break-all text-right">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 border dark:border-gray-700 rounded overflow-hidden">
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          value={JSON.stringify(response.body, null, 2)}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

    </div>
  );
}
