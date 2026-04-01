import { useState, useEffect } from "react";
import './App.css'

function App() {
  const [farms, setFarms] = useState([]);
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [cropType, setCropType] = useState("");
  const [moisture, setMoisture] = useState("");
  const [humidity, setHumidity] = useState("");
  const [leafWetness, setLeafWetness] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchFarms = () => {
    fetch("http://127.0.0.1:8000/api/farms/")
      .then(res => res.json())
      .then(data => setFarms(data));
  };

  useEffect(() => { fetchFarms(); }, []);

  const handleSubmit = async () => {
    const method = editingId ? "PATCH" : "POST";
    const farmUrl = editingId
      ? `http://127.0.0.1:8000/api/farms/${editingId}/`
      : "http://127.0.0.1:8000/api/farms/";

    const farmRes = await fetch(farmUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farm_name: farmName, location, owner_name: ownerName, crop_type: cropType })
    });
    const savedFarm = await farmRes.json();

    if (moisture || humidity || leafWetness) {
      await fetch("http://127.0.0.1:8000/api/sensors/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farm: editingId || savedFarm.id,
          soil_moisture: parseFloat(moisture || 0),
          soil_temperature: 28.5,
          soil_ph: 6.5,
          air_temperature: 30.2,
          humidity: parseFloat(humidity || 0),
          leaf_wetness: parseFloat(leafWetness || 0)
        })
      });
    }
    fetchFarms();
    clearForm();
  };

  const handleEdit = (farm) => {
    setEditingId(farm.id);
    setFarmName(farm.farm_name);
    setLocation(farm.location);
    setOwnerName(farm.owner_name);
    setCropType(farm.crop_type);
    if (farm.sensors && farm.sensors.length > 0) {
      const s = farm.sensors[farm.sensors.length - 1];
      setMoisture(s.soil_moisture);
      setHumidity(s.humidity);
      setLeafWetness(s.leaf_wetness);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setFarmName(""); setLocation(""); setOwnerName(""); setCropType("");
    setMoisture(""); setHumidity(""); setLeafWetness("");
  };

  const deleteFarm = (id) => {
    if (window.confirm("Remove this farm from FarmShield?")) {
      fetch(`http://127.0.0.1:8000/api/farms/${id}/`, { method: "DELETE" }).then(fetchFarms);
    }
  };

  const stats = farms.reduce((acc, f) => {
    const s = f.sensors?.at(-1);
    if (!s) { acc.noData++; return acc; }
    const l = s.threat_level?.toLowerCase();
    if (l === 'low') acc.low++;
    else if (l === 'medium') acc.medium++;
    else if (l === 'high') acc.high++;
    return acc;
  }, { low: 0, medium: 0, high: 0, noData: 0 });

  return (
    <div className="container">

      {/* ── HEADER ── */}
      <div className="page-header">
        <div className="header-logo">
          <span className="header-icon">🌾</span>
          <div>
            <h1>FarmShield AI</h1>
            <p className="header-sub">Smart Agricultural Monitoring · Philippines</p>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      {farms.length > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-icon green-icon">🌿</span>
            <div>
              <div className="stat-value">{stats.low}</div>
              <div className="stat-label">Low Risk</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon amber-icon">⚠️</span>
            <div>
              <div className="stat-value">{stats.medium}</div>
              <div className="stat-label">Medium Risk</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon red-icon">🚨</span>
            <div>
              <div className="stat-value">{stats.high}</div>
              <div className="stat-label">High Risk</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon grey-icon">🏡</span>
            <div>
              <div className="stat-value">{farms.length}</div>
              <div className="stat-label">Total Farms</div>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM CARD ── */}
      <div className="form-card">
        <div className="form-card-title">
          <h2>{editingId ? "✏️ Edit Farm & Sensor Data" : "＋ Register New Farm"}</h2>
          <p className="form-subtitle">
            {editingId
              ? "Update farm details and simulate new sensor readings."
              : "Add a new farm to your monitoring network."}
          </p>
        </div>

        <div className="input-grid">
          <div className="section">
            <h4>🏡 Farm Information</h4>
            <div className="field-group">
              <label>Farm Name</label>
              <input value={farmName} placeholder="e.g. Green Valley Farm"
                onChange={e => setFarmName(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Location / Barangay</label>
              <input value={location} placeholder="e.g. Indahag, CDO"
                onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Owner Name</label>
              <input value={ownerName} placeholder="e.g. Juan dela Cruz"
                onChange={e => setOwnerName(e.target.value)} />
            </div>
            <div className="field-group">
              <label>Crop Type</label>
              <input value={cropType} placeholder="e.g. Rice, Cacao, Banana"
                onChange={e => setCropType(e.target.value)} />
            </div>
          </div>

          <div className="section">
            <h4>📡 Sensor Simulation</h4>
            <div className="sensor-panel">
              <div className="field-group">
                <label>Soil Moisture (%)</label>
                <input type="number" value={moisture} placeholder="0 – 100"
                  onChange={e => setMoisture(e.target.value)} />
              </div>
              <div className="field-group">
                <label>Air Humidity (%)</label>
                <input type="number" value={humidity} placeholder="0 – 100"
                  onChange={e => setHumidity(e.target.value)} />
              </div>
              <div className="field-group">
                <label>Leaf Wetness Index</label>
                <input type="number" value={leafWetness} placeholder="0 – 100"
                  onChange={e => setLeafWetness(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="btn-row">
          <button className="add-btn" onClick={handleSubmit}>
            {editingId ? "✔ Update All Data" : "＋ Register Farm"}
          </button>
          {editingId && <button className="cancel-btn" onClick={clearForm}>✕ Cancel</button>}
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <div className="section-heading">
        🌍 Monitored Farms <span className="farm-count">({farms.length})</span>
      </div>

      {/* ── FARM GRID ── */}
      <div className="farm-grid">
        {farms.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <p>No farms registered yet. Add your first farm above.</p>
          </div>
        )}
        {farms.map(farm => {
          const s = farm.sensors?.at(-1);
          const threatClass = s?.threat_level?.toLowerCase() ?? '';
          return (
            <div key={farm.id} className="farm-card shadow">
              <div className="farm-header">
                <div className="farm-title-row">
                  <h3>{farm.farm_name}</h3>
                  <span className="badge">{farm.crop_type}</span>
                </div>
                <p className="farm-meta">
                  👤 {farm.owner_name}{farm.location ? ` · 📍 ${farm.location}` : ''}
                </p>
              </div>

              <div className="sensor-section">
                {s ? (
                  <>
                    <div className="reading-row">
                      <div className="reading">
                        <div className="reading-val">{s.soil_moisture}%</div>
                        <div className="reading-lbl">💧 Moisture</div>
                      </div>
                      <div className="reading">
                        <div className="reading-val">{s.humidity}%</div>
                        <div className="reading-lbl">☁️ Humidity</div>
                      </div>
                      <div className="reading">
                        <div className="reading-val">{s.leaf_wetness}</div>
                        <div className="reading-lbl">🍃 Wetness</div>
                      </div>
                    </div>
                    <div className={`threat-box ${threatClass}`}>
                      {threatClass === 'low' ? '🟢' : threatClass === 'medium' ? '🟡' : '🔴'} {s.threat_level} DISEASE RISK
                    </div>
                  </>
                ) : (
                  <p className="no-data">No sensor data yet. Click Edit/Simulate to add readings.</p>
                )}
              </div>

              <div className="btn-group">
                <button className="edit-btn" onClick={() => handleEdit(farm)}>✏ Edit / Simulate</button>
                <button className="delete-btn" onClick={() => deleteFarm(farm.id)}>🗑 Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;