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
    setHeaders(req.headers || [{ key: "", value: "" }]);
    setParams(req.params || [{ key: "", value: "" }]);
    setLocalError(null);
    setJsonError(null);
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

  // ✅ EXPORT JSON
  function exportRequestJson() {
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

  // ✅ IMPORT JSON
  function importRequestJson(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);

        if (!json.url || !json.method)
          return alert("Invalid request file format");

        setUrl(json.url);
        setMethod(json.method);
        setHeaders(json.headers || [{ key: "", value: "" }]);
        setParams(json.params || [{ key: "", value: "" }]);
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
        const parsed = resolveEnv(body, selectedEnv);
        resolvedBody = JSON.parse(parsed);
      }

      const headerObj = {};
      headers.forEach(({ key, value }) => {
        if (key.trim()) headerObj[key] = resolveEnv(value, selectedEnv);
      });

      const paramObj = {};
      params.forEach(({ key, value }) => {
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

      if (res?.error) return setLocalError(res.error);

      onResponse(res);
    } catch (err) {
      console.error(err);
      setLocalError("Network error — backend offline?");
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
          className={`
            px-4 py-2 pr-8 rounded font-bold border cursor-pointer
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

      {/* ✅ TABS */}
      <div className="flex border-b dark:border-gray-700 text-sm">
        {["params", "headers", "body"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 font-semibold
              ${activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}
            `}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ✅ PARAMS */}
      {activeTab === "params" && (
        <div>
          <p className="font-semibold text-sm mb-1">Query Params</p>
          {params.map((row, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                placeholder="Key"
                className="w-1/3 p-2 border rounded dark:bg-gray-700"
                value={row.key}
                onChange={(e) => {
                  const c = [...params];
                  c[idx].key = e.target.value;
                  setParams(c);
                }}
              />
              <input
                placeholder="Value"
                className="w-2/3 p-2 border rounded dark:bg-gray-700"
                value={row.value}
                onChange={(e) => {
                  const c = [...params];
                  c[idx].value = e.target.value;
                  setParams(c);
                }}
              />
              <button onClick={() => setParams(params.filter((_, i) => i !== idx))}>✕</button>
            </div>
          ))}
          <button
            onClick={() => setParams([...params, { key: "", value: "" }])}
            className="text-blue-600 text-sm"
          >
            + Add param
          </button>
        </div>
      )}

      {/* ✅ HEADERS */}
      {activeTab === "headers" && (
        <div>
          <p className="font-semibold text-sm mb-1">Headers</p>
          {headers.map((row, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                placeholder="Key"
                className="w-1/3 p-2 border rounded dark:bg-gray-700"
                value={row.key}
                onChange={(e) => {
                  const c = [...headers];
                  c[idx].key = e.target.value;
                  setHeaders(c);
                }}
              />
              <input
                placeholder="Value"
                className="w-2/3 p-2 border rounded dark:bg-gray-700"
                value={row.value}
                onChange={(e) => {
                  const c = [...headers];
                  c[idx].value = e.target.value;
                  setHeaders(c);
                }}
              />
              <button onClick={() => setHeaders(headers.filter((_, i) => i !== idx))}>✕</button>
            </div>
          ))}
          <button
            onClick={() => setHeaders([...headers, { key: "", value: "" }])}
            className="text-blue-600 text-sm"
          >
            + Add header
          </button>
        </div>
      )}

      {/* ✅ BODY */}
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

      {/* ✅ FILE IMPORT */}
      <input
        type="file"
        accept=".json"
        hidden
        id="importFile"
        onChange={(e) => importRequestJson(e.target.files[0])}
      />

      {/* ✅ BUTTONS */}
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
          onClick={() => document.getElementById("importFile").click()}
          className="bg-purple-600 text-white px-6 py-2 rounded ml-3"
        >
          Import JSON
        </button>
      </div>

    </div>
  );
}
