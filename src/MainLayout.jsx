import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ApiForm from "./components/ApiForm";
import ResponseViewer from "./components/ResponseViewer";
import EnvPanel from "./components/EnvPanel";
import api from "./lib/api";

export default function MainLayout({ accessToken }) {
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);

  // ✅ Load history
  useEffect(() => {
    if (!accessToken) return;

    (async () => {
      try {
        const data = await api.getHistory(accessToken);
        if (Array.isArray(data)) setHistory(data);
      } catch {
        setGlobalError("Network error loading history");
      }
    })();
  }, [accessToken]);
  console.log("ACCESS TOKEN:", accessToken);


  return (
    <div className="min-h-screen pt-16 bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* ERROR BANNER */}
      {globalError && (
        <div className="bg-red-500 text-white text-sm px-4 py-2 flex justify-between">
          <span>{globalError}</span>
          <button onClick={() => setGlobalError(null)} className="underline">
            Dismiss
          </button>
        </div>
      )}

      {/* BODY */}
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-64px)]">

        {/* SIDEBAR */}
        <div className="col-span-3 h-full">
          <Sidebar
            accessToken={accessToken}
            history={history}
            onSelectHistory={setSelectedRequest}
            onLoadFromCollection={setSelectedRequest}
            onCollectionSelect={setActiveCollection}
          />
        </div>

        {/* CENTER */}
        <div className="col-span-5 h-full flex flex-col gap-4 overflow-hidden">

          <EnvPanel
            accessToken={accessToken}
            onEnvSelect={setSelectedEnv}
          />

          <ApiForm
            accessToken={accessToken}
            selectedRequest={selectedRequest}
            selectedEnv={selectedEnv}
            activeCollection={activeCollection}
            onResponse={async (res) => {
              setResponse(res);
              try {
                const data = await api.getHistory(accessToken);
                if (Array.isArray(data)) setHistory(data);
              } catch {
                setGlobalError("Network error loading history");
              }
            }}
            onError={setGlobalError}
          />

        </div>

        {/* RESPONSE */}
        <div className="col-span-4 h-full">
          <ResponseViewer response={response} />
        </div>

      </div>
    </div>
  );
}
