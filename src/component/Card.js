import Carditem from "./Carditem.js";
import React, { useEffect, useState, useCallback } from "react";
const API_HOST = process.env.REACT_APP_RAPIDAPI_HOST;
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
export default function Card(props) {
  const [Results, setResults] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [matchType, setMatchType] = useState("International");
  const [availableFilters, setAvailableFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  const category = `${props.category}`;

  const getApiEndpoint = (cat) => {
    console.log("Fetching category:", cat);
    switch (cat) {
      case "live":
        return "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live";
      case "recent":
        return "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent";
      case "upcoming":
        return "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming";
      default:
        return "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live";
    }
  };

  const fetchMatches = useCallback(async (fetchCategory) => {
    setLoading(true);
    setMatchType("International"); // Reset filter when changing tab
    try {
      const endpoint = getApiEndpoint(fetchCategory);
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY,
        },
      });
      const data = await response.json();
      processMatches(data);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const processMatches = (data) => {
    const matches = [];
    const filters = new Set();

    if (data.typeMatches) {
      data.typeMatches.forEach((typeMatch) => {
        filters.add(typeMatch.matchType);
        if (typeMatch.seriesMatches) {
          typeMatch.seriesMatches.forEach((seriesMatch) => {
            if (
              seriesMatch.seriesAdWrapper &&
              seriesMatch.seriesAdWrapper.matches
            ) {
              seriesMatch.seriesAdWrapper.matches.forEach((match) => {
                matches.push({
                  matchId: match.matchInfo.matchId,
                  team1Name: match.matchInfo.team1?.teamName,
                  team2Name: match.matchInfo.team2?.teamName,
                  seriesName: match.matchInfo.seriesName,
                  matchDesc: match.matchInfo.matchDesc,
                  status: match.matchInfo.status,
                  startDate: match.matchInfo.startDate,
                  matchFormat: match.matchInfo.matchFormat,
                  venue: match.matchInfo.venueInfo?.ground,
                  matchType: typeMatch.matchType,
                  team1Id: match.matchInfo.team1?.teamId,
                  team2Id: match.matchInfo.team2?.teamId,
                });
              });
            }
          });
        }
      });
    }

    setAllMatches(matches);
    setAvailableFilters(Array.from(filters));
    
    const filtered = matches.filter((m) => m.matchType === "International");
    setResults(filtered);
    setLoading(false);
  };

  const handleFilterChange = (filter) => {
    setMatchType(filter);
    const filtered = allMatches.filter((m) => m.matchType === filter);
    setResults(filtered);
  };

  useEffect(() => {
    fetchMatches(category);
  }, [fetchMatches, category]);

  return (
    <>
      <div
        className="container-fluid"
        style={{
          backgroundColor: "#dbc1ac",

          boxShadow: "8px 8px 8px darkgray",
          borderRadius: "20px",
          border: "1px solid black",
          marginTop: "20px",
          padding: "20px",
        }}
      >
        <h1 className="text-left" id="head" style={{ marginTop: "10px" }}>
          <b>{props.match}</b>
        </h1>

        {/* Filter Buttons by Match Type */}
        <div
          className="d-flex justify-content gap-2 mb-4"
          style={{
            flexWrap: "wrap",
            padding: "10px",
            backgroundColor: "rgba(255,255,255,0.5)",
            borderRadius: "10px",
          }}
        >
          {availableFilters.map((filter) => (
            <button
              key={filter}
              className={`btn ${
                matchType === filter
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => handleFilterChange(filter)}
              style={{
                fontWeight: matchType === filter ? "bold" : "normal",
                fontSize: "1.05rem",
                padding: "8px 15px",
                borderRadius: "6px",
                color: "black",
                transition: "all 0.3s ease",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center" style={{ padding: "50px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p style={{ marginTop: "15px", fontSize: "1.1rem" }}>
              Loading matches...
            </p>
          </div>
        )}

        {!loading && Results.length === 0 && (
          <p
            className="text-center"
            style={{
              padding: "30px",
              fontSize: "1.1rem",
              color: "#666",
            }}
          >
            No matches found for this filter.
          </p>
        )}
  
        <div className="row">
          {Results.map((element) => (
            <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={element.matchId}>
              <Carditem
                home={element.team1Name}
                away={element.team2Name}
                sub={element.matchDesc}
                result={element.status}
                id={element.matchId}
                date={element.startDate}
                seriesName={element.seriesName}
                team1Id={element.team1Id}
                team2Id={element.team2Id}
                venue={element.venue}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
