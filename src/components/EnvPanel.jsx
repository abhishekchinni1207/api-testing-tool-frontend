import { useEffect, useState } from "react";
import api from "../lib/api";

export default function EnvPanel({ accessToken, onEnvSelect }) {
  const [envs, setEnvs] = useState([]);
  const [name, setName] = useState("");
  const [variables, setVariables] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // load envs only when token is available
    if (!accessToken) return;
    loadEnvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function loadEnvs() {
    try {
      setError("");
      const data = await api.getEnvs(accessToken);

      if (Array.isArray(data)) {
        setEnvs(data);
      } else {
        console.error("Env load error:", data);
        setError(data?.error || "Failed to load environments");
        setEnvs([]);
      }
    } catch (err) {
      console.error("Env load network error:", err);
      setError("Network error loading environments");
      setEnvs([]);
    }
  }

  async function createEnv() {
    try {
      setError("");
      if (!name || !variables) {
        setError("Name and variables are required");
        return;
      }

      let varsObj;
      try {
        varsObj = JSON.parse(variables);
      } catch {
        setError("Variables must be valid JSON");
        return;
      }

      const env = await api.createEnv(
        { name, variables: varsObj },
        accessToken
      );

      if (env?.error) {
        setError(env.error);
        return;
      }

      setEnvs((prev) => [...prev, env]);
      setName("");
      setVariables("");
    } catch (err) {
      console.error("Env create error:", err);
      setError("Failed to create environment");
    }
  }

  return (
   <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">


      <h3 className="font-semibold">Environments</h3>

      {/* Select existing env */}
      <select
        id="envi-name"
        name="envi-name"
        onChange={(e) => {
          const env = envs.find((env) => env.id === e.target.value) || null;
          onEnvSelect(env);
        }}
        className="w-full border p-2 rounded
             bg-white dark:bg-gray-700
             text-gray-900 dark:text-gray-100
             border-gray-300 dark:border-gray-600"
      >
        <option value="">Select Env</option>
        {envs.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>

      {/* Create new env */}
      <input
        id="env-name"
        name="env-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Environment Name (e.g. DEV)"
        className="w-full border p-2 rounded
             bg-white dark:bg-gray-700
             text-gray-900 dark:text-gray-100
             border-gray-300 dark:border-gray-600"
      />

      <textarea
        id="env-values"
        name="env-values"
        value={variables}
        onChange={(e) => setVariables(e.target.value)}
        placeholder='{"BASE_URL": "https://jsonplaceholder.typicode.com", "TOKEN": "123"}'
        className="w-full border p-2 rounded h-24 font-mono
             bg-white dark:bg-gray-700
             text-gray-900 dark:text-gray-100
             border-gray-300 dark:border-gray-600"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={createEnv}
        className="bg-green-600 text-white w-full p-2 rounded"
      >
        Save Environment
      </button>
    </div>
  );
}
