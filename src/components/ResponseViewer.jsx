import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function ResponseViewer({ response }) {
  const [showHeaders, setShowHeaders] = useState(false);

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center
          bg-white dark:bg-gray-800 text-gray-500 rounded-xl shadow">
        Waiting for response…
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="h-full p-6 rounded-xl shadow
          bg-white dark:bg-gray-800 text-red-500">
        ❌ {response.error}
      </div>
    );
  }

  const statusColor =
    response.status >= 200 && response.status < 300
      ? "text-green-500"
      : response.status >= 400
      ? "text-red-500"
      : "text-yellow-500";

  const responseText = (() => {
    try {
      return JSON.stringify(response.body, null, 2);
    } catch {
      return String(response.body);
    }
  })();

  function copyResponse() {
    navigator.clipboard.writeText(responseText);
    alert("Response copied ✅");
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        p-4 rounded-xl shadow flex flex-col">

      {/* HEADER */}
      <div className="mb-3 flex justify-between items-center text-sm">

        <div>
          <p className={`font-semibold ${statusColor}`}>
            Status: {response.status} {response.statusText}
          </p>
          <p className="text-xs text-gray-500">
            Time: {response.time} ms
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => setShowHeaders(!showHeaders)}
            className="text-xs px-2 py-1 rounded
              bg-gray-200 dark:bg-gray-700"
          >
            {showHeaders ? "Hide Headers" : "Show Headers"}
          </button>

          <button
            onClick={copyResponse}
            className="text-xs px-2 py-1 rounded
              bg-blue-600 text-white"
          >
            Copy
          </button>

        </div>
      </div>

      {/* HEADERS */}
      {showHeaders && (
        <div className="mb-3 p-2 max-h-[140px]
          overflow-y-auto rounded border
          bg-gray-50 dark:bg-gray-900">

          {Object.entries(response.headers || {}).map(([key, value]) => (
            <div key={key}
              className="flex justify-between text-xs
                font-mono gap-2 py-1 border-b dark:border-gray-700">

              <span className="text-blue-500">{key}</span>
              <span className="truncate text-right">
                {String(value)}
              </span>

            </div>
          ))}
        </div>
      )}

      {/* BODY */}
      <div className="flex-1 border dark:border-gray-700 rounded overflow-hidden">
        <Editor
          height="100%"
          language="json"
          theme="vs-dark"
          value={responseText}
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
