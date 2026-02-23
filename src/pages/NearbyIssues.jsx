import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { HiArrowUp } from "react-icons/hi";
import axios from "axios";
import { useEffect, useState } from "react";

/////////////////////////////
// ⭐ BEAUTIFUL CUSTOM PINS
/////////////////////////////

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [28, 46], // slightly bigger
    iconAnchor: [14, 46],
    popupAnchor: [0, -40],
  });

const redIcon = createIcon("red");       // High importance
const orangeIcon = createIcon("orange"); // Medium
const greenIcon = createIcon("green");   // Low

export default function NearbyIssues() {

  const [issues, setIssues] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

////////////////////////////////////////////////////
// ⭐ FETCH NEARBY ISSUES
////////////////////////////////////////////////////

  useEffect(() => {

    const fetchNearbyIssues = async () => {

      try {

        const lat = localStorage.getItem("userLat");
        const lng = localStorage.getItem("userLng");

        if (!lat || !lng) return;

        const parsedLocation = [parseFloat(lat), parseFloat(lng)];

        setUserLocation(parsedLocation);

        const res = await axios.get(
          `http://localhost:5000/api/issues/nearby?lat=${lat}&lng=${lng}`
        );

        setIssues(res.data);

      } catch (err) {
        console.log("Error fetching nearby issues", err);
      }
    };

    fetchNearbyIssues();

  }, []);

////////////////////////////////////////////////////
// ⭐ UPVOTE
////////////////////////////////////////////////////

  const handleUpvote = async (issueId) => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/issues/${issueId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // instant update
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? res.data : issue
        )
      );

    } catch (err) {

      alert(
        err.response?.data?.message || "Already upvoted!"
      );
    }
  };

////////////////////////////////////////////////////
// ⭐ ICON LOGIC
////////////////////////////////////////////////////

  const getIcon = (upvotes) => {

    if (upvotes >= 10) return redIcon;
    if (upvotes >= 5) return orangeIcon;
    return greenIcon;
  };

////////////////////////////////////////////////////
// ⭐ LOADING STATE (PRO FEEL)
////////////////////////////////////////////////////

  if (!userLocation) {

    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white text-xl">
        Detecting your location...
      </div>
    );
  }

////////////////////////////////////////////////////
// ⭐ UI
////////////////////////////////////////////////////

  return (
    <div style={{ height: "100vh", width: "100vw" }}>

      {/* Floating Glass Header */}
      <div className="
        absolute top-5 left-1/2 -translate-x-1/2
        z-[1000]
        bg-slate-900/70 backdrop-blur-xl
        px-8 py-4 rounded-2xl
        shadow-2xl border border-white/10
        text-white
      ">
        <h1 className="text-xl font-semibold">
          Nearby Civic Issues
        </h1>

        <p className="text-sm text-gray-400">
          Community-powered problem detection
        </p>
      </div>


      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="
          absolute top-5 right-5 z-[1000]
          bg-indigo-600 hover:bg-indigo-700
          text-white px-5 py-2
          rounded-xl shadow-lg
          transition hover:scale-105
        "
      >
        Back
      </button>




      <MapContainer
        center={userLocation}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >

        {/* Dark Theme Map */}
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />


        {/* ⭐ USER GLOW */}
        <Circle
          center={userLocation}
          radius={200}
          pathOptions={{
            color: "#6366f1",
            fillColor: "#6366f1",
            fillOpacity: 0.15,
          }}
        />

        <Marker position={userLocation}>
          <Popup>You are here 📍</Popup>
        </Marker>




        <MarkerClusterGroup>

          {issues.map((issue) => {

            const lat = issue.location.coordinates[1];
            const lng = issue.location.coordinates[0];

            return (
              <Marker
                key={issue._id}
                position={[lat, lng]}
                icon={getIcon(issue.upvotes)}
              >

                <Popup>

{/* ⭐ BEAUTIFUL CARD */}

                  <div className="w-60">

                    <img
                      src={issue.imageUrl}
                      alt=""
                      className="rounded-xl mb-3 h-32 w-full object-cover"
                    />

                    <h2 className="font-bold text-lg mb-1">
                      {issue.title}
                    </h2>

                    <p className="text-sm text-gray-600 mb-2">
                      {issue.description}
                    </p>

                    <div className="flex justify-between items-center">

                      {/* Badge */}
                      <span className="
                        text-xs px-2 py-1 rounded-md
                        bg-indigo-600 text-white
                      ">
                        REPORTED
                      </span>


                      {/* Upvote */}
                      <button
                        onClick={() => handleUpvote(issue._id)}
                        className="
                          flex items-center gap-1
                          bg-indigo-600 hover:bg-indigo-700
                          text-white px-3 py-1
                          rounded-lg text-sm
                          transition transform hover:scale-110
                        "
                      >
                        <HiArrowUp />
                        {issue.upvotes}
                      </button>

                    </div>

                  </div>

                </Popup>

              </Marker>
            );
          })}

        </MarkerClusterGroup>

      </MapContainer>

    </div>
  );
}
