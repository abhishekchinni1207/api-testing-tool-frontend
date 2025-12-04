import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Sidebar({
  accessToken,
  history,
  onSelectHistory,
  onLoadFromCollection,
  onCollectionSelect,
}) {
  const [collections, setCollections] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [name, setName] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (accessToken) loadCollections();
    else {
      setCollections([]);
      setItems([]);
      setSelectedId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function loadCollections() {
    const data = await api.getCollections(accessToken);
    setCollections(data || []);
  }

  async function loadItems(id) {
    setSelectedId(id);
    setItems([]);

    try {
      const data = await api.getCollectionItems(id, accessToken);
      if (Array.isArray(data)) setItems(data);
      else alert(data?.error || "Failed to load collection items");
    } catch {
      alert("Network error loading collection");
    }
  }

  async function create() {
    if (!name.trim()) return;
    await api.createCollection(name, accessToken);
    setName("");
    loadCollections();
  }

  // ✅ DELETE COLLECTION
  async function deleteCollection(id) {
    if (!window.confirm("Delete this collection and all items inside it?"))
      return;

    setBusyId(id);
    const res = await api.deleteCollection(id, accessToken);
    setBusyId(null);

    if (res?.error) return alert(res.error);

    if (selectedId === id) {
      setSelectedId(null);
      setItems([]);
    }

    loadCollections();
  }

  // ✅ DELETE HISTORY (NO PAGE REFRESH)
  async function deleteHistory(id) {
    if (!window.confirm("Delete this history item?")) return;

    const res = await api.deleteHistory(id, accessToken);
    if (res?.error) return alert(res.error);

    // Remove locally
    onSelectHistory(null);
  }

  // ✅ DELETE COLLECTION ITEM
  async function deleteItem(id) {
    if (!window.confirm("Delete this request from collection?")) return;

    setBusyId(id);
    const res = await api.deleteCollectionItem(id, accessToken);
    setBusyId(null);

    if (res?.error) return alert(res.error);

    loadItems(selectedId);
  }

  const colors = {
    GET: "text-green-500",
    POST: "text-orange-500",
    PUT: "text-blue-500",
    DELETE: "text-red-500",
    PATCH: "text-purple-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-xl shadow">

      {/* HISTORY */}
      <h2 className="font-semibold">History</h2>

      {history.map((item) => (
        <div key={item.id} className="flex items-center group">

          <button
            onClick={() => onSelectHistory(item)}
            className="flex-1 text-left p-2 rounded
              hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className={`font-bold mr-1 ${colors[item.method]}`}>
              {item.method}
            </span>
            <span className="text-sm break-all opacity-80">{item.url}</span>
          </button>

          <button
            onClick={() => deleteHistory(item.id)}
            className="text-red-500 opacity-0 group-hover:opacity-100 px-2"
            title="Delete history"
          >
            🗑
          </button>

        </div>
      ))}

      {/* CREATE COLLECTION */}
      <h2 className="font-semibold mt-4">Collections</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New collection name"
        className="bg-white dark:bg-gray-700
          border border-gray-300 dark:border-gray-600
          p-2 rounded w-full"
      />

      <button
        onClick={create}
        className="bg-blue-600 text-white
          w-full p-2 rounded mt-2"
      >
        Create
      </button>

      {/* COLLECTIONS */}
      {collections.map((col) => (
        <div key={col.id} className="mt-2">

          <div className="flex justify-between items-center">

            <button
              onClick={() => {
                onCollectionSelect(col.id);
                loadItems(col.id);
              }}
              className="font-medium"
            >
              📁 {col.name}
            </button>

            <button
              title="Delete collection"
              disabled={busyId === col.id}
              onClick={() => deleteCollection(col.id)}
              className="text-red-500 hover:text-red-700"
            >
              {busyId === col.id ? "⏳" : "❌"}
            </button>

          </div>

          {/* ITEMS */}
          {selectedId === col.id &&
            Array.isArray(items) &&
            items.map((i) => (
              <div key={i.id} className="flex items-center group">

                <button
                  onClick={() => onLoadFromCollection(i.request)}
                  className="flex-1 text-left pl-4 py-1
                    rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <span
                    className={`font-bold mr-1 ${
                      colors[i.request.method]
                    }`}
                  >
                    {i.request.method}
                  </span>
                  <span className="text-xs break-all opacity-80">
                    {i.request.url}
                  </span>
                </button>

                <button
                  onClick={() => deleteItem(i.id)}
                  disabled={busyId === i.id}
                  className="text-red-500 opacity-0
                    group-hover:opacity-100 px-2"
                  title="Delete item"
                >
                  {busyId === i.id ? "⏳" : "🗑"}
                </button>

              </div>
            ))}

        </div>
      ))}
    </div>
  );
}
