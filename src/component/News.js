import React, { Component } from "react";

import Spinner from "./Spinner";


export class News extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      loading: false,
      page: null,
      nextPage: null,
      previousPage: null,
      totalResults: 0,
      pageHistory: [],
    };
  }

  
  async componentDidMount() {
    
      let url = `https://newsdata.io/api/1/news?apikey=${process.env.REACT_APP_NEWSDATA_API_KEY}&country=in&language=en&q=cricket`;
      this.setState({ loading: true });

      try {
        let data = await fetch(url);
        let parsedData = await data.json();

        const newPageHistory = [parsedData.results || []];
        localStorage.setItem("cricketNewsHistory", JSON.stringify(newPageHistory));

        this.setState({
          results: parsedData.results || [],
          totalResults: parsedData.totalResults || 0,
          page: parsedData.page || null,
          nextPage: parsedData.nextPage || null,
          previousPage: parsedData.previousPage || null,
          loading: false,
          pageHistory: newPageHistory,
        });
      } catch (error) {
        console.error("Error fetching news:", error);
        this.setState({
          results: [],
          totalResults: 0,
          loading: false,
        });
      }
   
    
  }
  previousclick = async () => {
    const { pageHistory } = this.state;
    if (pageHistory.length > 1) {
      const newHistory = pageHistory.slice(0, -1);
      const previousResults = newHistory[newHistory.length - 1];
      
      localStorage.setItem("cricketNewsHistory", JSON.stringify(newHistory));
      
      this.setState({
        results: previousResults,
        pageHistory: newHistory,
        loading: false,
      });
    }
  };

  nextclick = async () => {
    const { nextPage, pageHistory } = this.state;
    if (nextPage) {
      let url = `https://newsdata.io/api/1/news?apikey=${process.env.REACT_APP_NEWSDATA_API_KEY}&country=in&language=en&q=cricket&page=${nextPage}`;
      this.setState({ loading: true });
      try {
        let data = await fetch(url);
        let parsedData = await data.json();

        const newPageHistory = [...pageHistory, parsedData.results || []];
        localStorage.setItem("cricketNewsHistory", JSON.stringify(newPageHistory));

        this.setState({
          results: parsedData.results || [],
          page: parsedData.page || null,
          nextPage: parsedData.nextPage || null,
          previousPage: parsedData.previousPage || null,
          loading: false,
          pageHistory: newPageHistory,
        });
      } catch (error) {
        console.error("Error fetching next news:", error);
        this.setState({ loading: false });
      }
    }
  };

  render() {
    return (
      <>
       

        <div className="container">
         

          <h1 className="text-center" id="head" style={{ marginTop: "20px" }}>
            <b>Crciket News</b>
          </h1>
          {this.state.loading && <Spinner />}
          <div className="row">
            {!this.state.loading &&
              this.state.results.map((element) => {
                  return (
                    <div className="col-md-4 mb-3" key={element.link}>
                     
                      <div className='my-3'>
                <div className="card" style={{ border: "1px solid black" }}>
                    
                    <img src={!element.image_url ? "https://source.unsplash.com/1920x1080/?{title}" :element.image_url} className="card-img-top" alt="..." style={{height: "190px", borderBottom: "1px solid black" }} />
                    <div className="card-body">
                <h5 className="card-title"><b>{element.title ? element.title.slice(0, 45) : ""}...</b></h5>
                        <p className="card-text">{
                          element.description
                            ? element.description.slice(0, 88)
                            : ""
                        }...</p>
                        <p className='card-text'><small className='text-muted'>Published On - {new Date(`${element.pubDate}`).toGMTString()}</small></p>
                        <a rel="noreferrer" href={element.link} target="_blank" className="btn btn-primary">Read More</a>
                    </div>
                </div>
            </div>
                    </div>
                  );
                })}
          </div>
          <div className="container d-flex justify-content-between">
            <button
              type="button"
              disabled={this.state.pageHistory.length <= 1}
              className="btn btn-dark"
              onClick={this.previousclick}
            >
              {" "}
              &larr; Previous
            </button>
            <button
              type="button"
              disabled={!this.state.nextPage}
              className="btn btn-dark"
              onClick={this.nextclick}
            >
              Next &rarr;
            </button>
          </div>
        </div>
    
      </>
    );
  }
}

export default News;
