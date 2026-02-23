import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});


const getIcon = (status) => {
  let color = "blue";

  if (status === "Pending") color = "orange";
  if (status === "Approved") color = "blue";
  if (status === "In Progress") color = "violet";
  if (status === "Completed") color = "green";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

function AdminMap({ issues }) {

  const defaultCenter = [13.067439, 80.27847];

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10">
     
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{
          height: "450px",
          width: "100%",
        }}
      >
        {/* 🔥 Dark Mode Map (Looks INSANE) */}
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* MARKERS */}
        {issues.map((issue) => {

          if (!issue.location?.coordinates) return null;

          // GeoJSON format → [lng, lat]
          const [lng, lat] = issue.location.coordinates;

          return (
            <Marker
              key={issue._id}
              position={[lat, lng]}
              icon={getIcon(issue.status)}
            >
              <Popup>
                <div style={{ color: "#111" }}>
                  
                  <h3 style={{ fontWeight: "bold" }}>
                    {issue.title}
                  </h3>

                  <p>Status: {issue.status}</p>

                  <p>
                    📍 {issue.location?.address || "No address"}
                  </p>

                  <p>
                    🔥 Upvotes: {issue.upvotes || 0}
                  </p>

                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

    </div>
  );
}

export default AdminMap;
