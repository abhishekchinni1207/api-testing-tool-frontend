import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../lib/api";
import { resolveEnv } from "../utils/envResolver";

export default function ApiForm({
  accessToken,
  selectedRequest,
  selectedEnv,
  onResponse,
  activeCollection,
}) {
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("params");

  // ✅ Load from history / collection
  useEffect(() => {
    if (!selectedRequest) return;

    const req = selectedRequest.request || selectedRequest;

    setUrl(req.url || "");
    setMethod(req.method || "GET");
    setBody(req.body ? JSON.stringify(req.body, null, 2) : "");

    // headers: can be array or object
    const parsedHeaders = Array.isArray(req.headers)
      ? req.headers
      : req.headers
      ? Object.entries(req.headers).map(([k, v]) => ({ key: k, value: v }))
      : [{ key: "", value: "" }];

    const parsedParams = Array.isArray(req.params)
      ? req.params
      : req.params
      ? Object.entries(req.params).map(([k, v]) => ({ key: k, value: v }))
      : [{ key: "", value: "" }];

    setHeaders(parsedHeaders);
    setParams(parsedParams);
    setJsonError(null);
    setLocalError(null);
  }, [selectedRequest]);

  function validateJson(v) {
    if (!v) return setJsonError(null);
    try {
      JSON.parse(v);
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON");
    }
  }

  function handleEditorChange(v) {
    const value = v || "";
    setBody(value);
    validateJson(value);
  }

  // ✅ Export current request as JSON file
  function exportRequestJson() {
    if (!url) return alert("Nothing to export");

    try {
      const exportData = {
        method,
        url,
        headers,
        params,
        body: body ? JSON.parse(body) : null,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "api-request.json";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      alert("Invalid JSON — cannot export");
    }
  }

  // ✅ Import request JSON file
  function importRequestJson(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        if (!json.url || !json.method) {
          alert("Invalid request file format");
          return;
        }

        setUrl(json.url);
        setMethod(json.method);
        setHeaders(
          Array.isArray(json.headers) ? json.headers : [{ key: "", value: "" }]
        );
        setParams(
          Array.isArray(json.params) ? json.params : [{ key: "", value: "" }]
        );
        setBody(json.body ? JSON.stringify(json.body, null, 2) : "");

        alert("Request imported ✅");
      } catch {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  }

  async function saveToCollection() {
    if (!activeCollection) return alert("Select a collection first");

    try {
      const requestObj = {
        url,
        method,
        headers,
        params,
        body: body ? JSON.parse(body) : null,
      };

      await api.addToCollection(activeCollection, requestObj, accessToken);
      alert("Saved to collection ✅");
    } catch {
      alert("Invalid JSON — cannot save");
    }
  }

  async function sendRequest() {
    setLocalError(null);

    if (!url.trim()) return setLocalError("URL is required");
    if (jsonError) return setLocalError("Fix JSON format first");

    try {
      setLoading(true);

      const resolvedUrl = resolveEnv(url, selectedEnv);
      let resolvedBody;

      if (body) {
        const replaced = resolveEnv(body, selectedEnv);
        resolvedBody = JSON.parse(replaced);
      }

      const headerObj = {};
      (Array.isArray(headers) ? headers : []).forEach(({ key, value }) => {
        if (key.trim()) headerObj[key] = resolveEnv(value, selectedEnv);
      });

      const paramObj = {};
      (Array.isArray(params) ? params : []).forEach(({ key, value }) => {
        if (key.trim()) paramObj[key] = resolveEnv(value, selectedEnv);
      });

      const payload = {
        url: resolvedUrl,
        method,
        headers: headerObj,
        params: paramObj,
        body: resolvedBody,
      };

      const res = await api.proxy(payload, accessToken);

      if (res?.error) {
        setLocalError(res.error);
        return;
      }

      onResponse(res);
    } catch (err) {
      console.error(err);
      setLocalError("Request failed. Check backend URL or authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-4">
      {/* URL */}
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://api.example.com"
        className="w-full p-2 rounded border dark:bg-[#1e1e1e] dark:border-gray-700"
      />

      {/* METHOD */}
      <div className="relative inline-block">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`px-4 py-2 pr-8 rounded font-bold border cursor-pointer
            bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600
            ${method === "GET" && "text-green-500"}
            ${method === "POST" && "text-orange-500"}
            ${method === "PUT" && "text-blue-500"}
            ${method === "DELETE" && "text-red-500"}
            ${method === "PATCH" && "text-purple-500"}
          `}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>
      </div>

      {/* TABS */}
      <div className="flex border-b dark:border-gray-700 text-sm">
        {["params", "headers", "body"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 font-semibold
              ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* PARAMS */}
      {activeTab === "params" && (
        <div>
          {(Array.isArray(params) ? params : []).map((row, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={row.key}
                onChange={(e) => {
                  const c = [...params];
                  c[idx].key = e.target.value;
                  setParams(c);
                }}
                placeholder="Key"
                className="w-1/3 p-2 border rounded dark:bg-gray-700"
              />
              <input
                value={row.value}
                onChange={(e) => {
                  const c = [...params];
                  c[idx].value = e.target.value;
                  setParams(c);
                }}
                placeholder="Value"
                className="w-2/3 p-2 border rounded dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={() =>
                  setParams((Array.isArray(params) ? params : []).filter(
                    (_, i) => i !== idx
                  ))
                }
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setParams([...(Array.isArray(params) ? params : []), { key: "", value: "" }])
            }
            className="text-blue-600 text-sm"
          >
            + Add param
          </button>
        </div>
      )}

      {/* HEADERS */}
      {activeTab === "headers" && (
        <div>
          {(Array.isArray(headers) ? headers : []).map((row, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={row.key}
                onChange={(e) => {
                  const c = [...headers];
                  c[idx].key = e.target.value;
                  setHeaders(c);
                }}
                placeholder="Key"
                className="w-1/3 p-2 border rounded dark:bg-gray-700"
              />
              <input
                value={row.value}
                onChange={(e) => {
                  const c = [...headers];
                  c[idx].value = e.target.value;
                  setHeaders(c);
                }}
                placeholder="Value"
                className="w-2/3 p-2 border rounded dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={() =>
                  setHeaders((Array.isArray(headers) ? headers : []).filter(
                    (_, i) => i !== idx
                  ))
                }
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setHeaders([
                ...(Array.isArray(headers) ? headers : []),
                { key: "", value: "" },
              ])
            }
            className="text-blue-600 text-sm"
          >
            + Add header
          </button>
        </div>
      )}

      {/* BODY */}
      {activeTab === "body" && (
        <Editor
          height="220px"
          language="json"
          theme="vs-dark"
          value={body}
          onChange={handleEditorChange}
          options={{ minimap: { enabled: false }, fontSize: 13 }}
        />
      )}

      {jsonError && <p className="text-red-500 text-xs">Invalid JSON format</p>}
      {localError && <p className="text-red-500 text-xs">{localError}</p>}

      {/* Hidden file input for import */}
      <input
        type="file"
        hidden
        id="importFile"
        accept=".json"
        onChange={(e) => importRequestJson(e.target.files[0])}
      />

      {/* Buttons */}
      <div>
        <button
          onClick={sendRequest}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>

        <button
          onClick={saveToCollection}
          className="bg-green-600 text-white px-6 py-2 rounded ml-3"
        >
          + Save
        </button>

        <button
          onClick={exportRequestJson}
          className="bg-gray-700 text-white px-6 py-2 rounded ml-3"
        >
          Export JSON
        </button>

        <button
          onClick={() =>
            document.getElementById("importFile")?.click()
          }
          className="bg-purple-600 text-white px-6 py-2 rounded ml-3"
        >
          Import JSON
        </button>
      </div>
    </div>
  );
}
