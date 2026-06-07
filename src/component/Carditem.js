import React from "react";
import { Button } from "@material-ui/core";
import { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
const API_HOST = process.env.REACT_APP_RAPIDAPI_HOST;
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

export default function Carditem(props) {
  const date = new Date(parseInt(props.date));
  const time = date.toLocaleString("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formatted = day + "-" + month + "-" + year;

  const [open, setOpen] = React.useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedInnings, setExpandedInnings] = useState(null);
  const [expandedPlayingXI, setExpandedPlayingXI] = useState(false);

  const handleClickOpen = async () => {
    setOpen(true);
    setLoading(true);
    await fetchMatchDetails();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchMatchDetails = async () => {
    try {
      // Fetch match details
      const detailsRes = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${props.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      const detailsData = await detailsRes.json();
      setMatchDetails(detailsData);

      // Fetch team 1 details
      const team1Res = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${props.id}/team/${props.team1Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      const team1Data = await team1Res.json();
      if (team1Data.player && team1Data.player[0]) {
        setTeam1Players(team1Data.player[0].player || []);
      }

      // Fetch team 2 details
      const team2Res = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${props.id}/team/${props.team2Id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      const team2Data = await team2Res.json();
      if (team2Data.player && team2Data.player[0]) {
        setTeam2Players(team2Data.player[0].player || []);
      }

      // Fetch scorecard
      const scorecardRes = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${props.id}/hscard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY,
          },
        }
      );
      const scorecardData = await scorecardRes.json();
      console.log("Scorecard Data:", scorecardData);
      setScorecard(scorecardData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching match details:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-3">
        <div
          className="card"
          style={{
            border: "1px solid black",
            borderRadius: "10px",
            boxShadow: "8px 8px 8px #333334",
            height: "350px",
          }}
        >
          <div className="card-body">
            <h4
              className="card-title"
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <b>{props.home}</b>
            </h4>
            <h4
              className="card-title"
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <b>VS</b>
            </h4>
            <h4
              className="card-title"
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <b>{props.away}</b>
            </h4>

            <h5
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <p style={{ textAlign: "center" }}>{props.sub}</p>
            </h5>
            <p style={{ textAlign: "center" }}>
              Match Date:- {formatted} at {time} (IST)
            </p>
            <p className="card-text" style={{ textAlign: "center" }}>
              {props.result}
            </p>

            <Button
              size="small"
              variant="contained"
              color="primary"
              style={{ position: "absolute", bottom: "15px", left: "20px" }}
              onClick={handleClickOpen}
            >
              More Details
            </Button>
            <Dialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                <p
                  className="text"
                  style={{
                    fontFamily: "Comic Neue, cursive",
                    marginBottom: "0px",
                    fontWeight: "bolder",
                  }}
                >
                  {props.seriesName}
                </p>
              </DialogTitle>
              <DialogContent
                dividers
                style={{
                  fontFamily: "Comic Neue, cursive",
                }}
              >
                {loading ? (
                  <p>Loading match details...</p>
                ) : (
                  <>
                    {matchDetails && (
                      <>
                        <Typography gutterBottom>
                          <h5
                            style={{
                              marginBottom: "5px",
                              fontFamily: "Comic Neue, cursive",
                            }}
                          >
                            <b>Status:</b> {matchDetails.status}
                          </h5>
                        </Typography>

                        <h4
                          style={{
                            marginTop: "20px",
                            borderBottom: "1px solid gray",
                          }}
                        >
                          Match Info:-
                        </h4>
                        <Typography
                          gutterBottom
                          style={{
                            fontFamily: "Comic Neue, cursive",
                          }}
                        >
                          <b>Toss:</b> {matchDetails.tossstatus}
                        </Typography>
                        <Typography gutterBottom>
                          <b>Venue:</b> {matchDetails.venueinfo?.ground}
                        </Typography>
                        <Typography gutterBottom>
                          <b>Format:</b> {matchDetails.matchformat}
                        </Typography>
                      </>
                    )}

                    {scorecard && (
                      <>
                        <h5 style={{ marginTop: "15px", marginBottom: "10px" }}>
                          <b>Scorecard:</b>
                        </h5>
                        {scorecard.scorecard && Array.isArray(scorecard.scorecard) && scorecard.scorecard.length > 0 ? (
                          <>
                            {scorecard.scorecard.map((innings, inningsIdx) => (
                              <>
                                <div
                                  key={inningsIdx}
                                  onClick={() => setExpandedInnings(expandedInnings === inningsIdx ? null : inningsIdx)}
                                  style={{
                                    marginTop: "15px",
                                    marginBottom: "10px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    userSelect: "none",
                                    background : "lightgrey"
                                  }}
                                >
                                  <span>
                                    {innings.batteamname || `Innings ${inningsIdx + 1}`}: {innings.score || "N/A"}/
                                    {innings.wickets || "N/A"} ({innings.overs || "N/A"} overs)
                                  </span>
                                  <span style={{ fontSize: "1.2rem" }}>
                                    {expandedInnings === inningsIdx ? "▼" : "▶"}
                                  </span>
                                </div>
                                
                                {expandedInnings === inningsIdx && (
                                  <>
                                    {innings.batsman && Array.isArray(innings.batsman) && innings.batsman.length > 0 && (
                                      <div style={{ marginLeft: "10px", fontSize: "0.85rem", marginBottom: "10px", marginTop: "-5px", padding: "8px", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "4px" }}>
                                        <b>Batting:</b>
                                        {innings.batsman.map((batsman, idx) => (
                                          <div key={idx} style={{ marginTop: "5px", paddingLeft: "10px", borderLeft: "2px solid #999" }}>
                                            <span style={{ fontWeight: "bold" }}>
                                              {batsman.name || "Unknown"}
                                              {batsman.iscaptain && <span> ⭐(C)</span>}
                                              {batsman.iskeeper && <span> 🧤(WK)</span>}
                                            </span>
                                            <span> - {batsman.runs || 0} runs</span>
                                            {batsman.balls && <span> ({batsman.balls} balls)</span>}
                                            {batsman.fours && <span>, 4s: {batsman.fours}</span>}
                                            {batsman.sixes && <span>, 6s: {batsman.sixes}</span>}
                                            <br />
                                            <small style={{ color: "#666" }}>
                                              {batsman.outdec ? batsman.outdec : "Not Out"}
                                            </small>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {innings.bowler && Array.isArray(innings.bowler) && innings.bowler.length > 0 && (
                                      <div style={{ marginLeft: "10px", fontSize: "0.85rem", padding: "8px", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "4px" }}>
                                        <b>Bowling:</b>
                                        {innings.bowler.map((bowler, idx) => (
                                          <div key={idx} style={{ marginTop: "5px", paddingLeft: "10px", borderLeft: "2px solid #999" }}>
                                            <span style={{ fontWeight: "bold" }}>{bowler.name || "Unknown"}</span>
                                            <span> - {bowler.wickets || 0}W/{bowler.runs || 0}R</span>
                                            {bowler.overs && <span> ({bowler.overs})</span>}
                                            {bowler.economy && <span>, Econ: {bowler.economy}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            ))}
                          </>
                        ) : (
                          <p style={{ fontStyle: "italic", color: "#666", marginTop: "10px" }}>
                            Scorecard data not yet available (match may not have started)
                          </p>
                        )}
                      </>
                    )}

                    <h5 style={{ fontFamily: "Comic Neue, cursive", marginTop: "15px" }}>
                      <div
                        onClick={() => setExpandedPlayingXI(!expandedPlayingXI)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px",
                          borderRadius: "4px",
                          userSelect: "none",
                          background: "lightgrey",
                        }}
                      >
                        <b>Playing XI</b>
                        <span style={{ fontSize: "1.2rem" }}>
                          {expandedPlayingXI ? "▼" : "▶"}
                        </span>
                      </div>
                    </h5>
                    {expandedPlayingXI && (
                      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontFamily: "Comic Neue, cursive", fontWeight: "bold", marginBottom: "10px" }}>
                            {props.home}
                          </h6>
                          <Typography gutterBottom>
                            {team1Players.length > 0 ? (
                              team1Players.map((player, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    fontFamily: "Comic Neue, cursive",
                                    marginBottom: "8px",
                                    fontSize: "0.9rem",
                                    paddingLeft: "8px",
                                    borderLeft: "2px solid #999",
                                  }}
                                >
                                  <span style={{ fontWeight: "bold" }}>
                                    {player.name}{" "}
                                    {player.captain && <span>⭐(C)</span>}
                                    {player.keeper && <span>🧤(WK)</span>}
                                  </span>
                                  <br />
                                  <small style={{ color: "#666" }}>
                                    {player.role}
                                  </small>
                                </div>
                              ))
                            ) : (
                              <p>No player data available</p>
                            )}
                          </Typography>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontFamily: "Comic Neue, cursive", fontWeight: "bold", marginBottom: "10px" }}>
                            {props.away}
                          </h6>
                          <Typography gutterBottom>
                            {team2Players.length > 0 ? (
                              team2Players.map((player, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    fontFamily: "Comic Neue, cursive",
                                    marginBottom: "8px",
                                    fontSize: "0.9rem",
                                    paddingLeft: "8px",
                                    borderLeft: "2px solid #999",
                                  }}
                                >
                                  <span style={{ fontWeight: "bold" }}>
                                    {player.name}{" "}
                                    {player.captain && <span>⭐(C)</span>}
                                    {player.keeper && <span>🧤(WK)</span>}
                                  </span>
                                  <br />
                                  <small style={{ color: "#666" }}>
                                    {player.role}
                                  </small>
                                </div>
                              ))
                            ) : (
                              <p>No player data available</p>
                            )}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
