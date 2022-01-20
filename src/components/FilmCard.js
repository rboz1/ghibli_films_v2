import React from 'react';
import '../styles/FilmCard.css';
import {ReactComponent as Logo} from './TotoroLogo.svg';

const axios = require('axios');

export class FilmCard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            films: [],
            filmTitle: [],
            posterBaseURL: "",
            posterPath: [],
            loading: true,
            imgLoading: true
        }

        this.handleClick = this.handleClick.bind(this);
    };
    
    componentDidMount(){

        const urls = [
            "https://ghibliapi.herokuapp.com/films",
            "https://api.themoviedb.org/3/configuration?api_key=003a94765d623075239ba52a960adb08"
        ]
        
        Promise.all(urls.map(req=>axios.get(req, { timeout: 2000 })))
            .then((res)=>{
                setTimeout(()=>{
                    this.setState({
                        films: res[0].data,
                        filmTitle: res[0].data.map(el => el.original_title),
                        posterBaseURL: res[1].data.images.base_url + res[1].data.images.poster_sizes[6],
                        loading: false
                    })

                    let url3 = this.state.filmTitle.map(title=>axios.get(`https://api.themoviedb.org/3/search/movie?api_key=003a94765d623075239ba52a960adb08&language=en-US&query=${ title }`, { timeout: 2000 }))
                    Promise.all(url3)
                        .then((res) => {this.setState({
                            posterPath: res.map(path=>path.data.results[0].poster_path),
                            imgLoading: false
                        })})
                        .catch(error => {
                            if (error.response) {console.log(error.response.status);
                              // The request was made and the server responded with a status code
                              // that falls out of the range of 2xx

                            } else if (error.request) {
                              // The request was made but no response was received
                              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                              // http.ClientRequest in node.js
                              console.log(error.request);
                            } else {
                              // Something happened in setting up the request that triggered an Error
                              console.log('Error', error.message);
                            }
                            console.log(error.config);
                          });
                }, 1000)})

                .catch(error => {
                    if (error.response) {console.log(error.response.status);
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx

                    } else if (error.request) {
                      // The request was made but no response was received
                      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                      // http.ClientRequest in node.js
                      console.log(error.request);
                    } else {
                      // Something happened in setting up the request that triggered an Error
                      console.log('Error', error.message);
                    }
                    console.log(error.config);
                  });
    }

    //toggle flip class on clicked element
    handleClick(e){
        e.currentTarget.classList.toggle("flip");
    }   

    render(){
        return (
        <main>
            {this.state.loading && this.state.imgLoading ? <div id = "load"><Logo /><h1>Loading...</h1></div>

            : this.state.imgLoading ? this.state.films.map((film, index) =>(
                    <div className= "card-alt" key = {index}>
                            <div className = "card-back-alt">
                                <h1>{ film.title }</h1>
                                <h2>{ film.original_title }</h2>
                                <h3>{ film.release_date }</h3>
                                <p>{ film.description }</p>
                        </div>
                    </div>))

            : this.state.films.map((film, index) =>(
                <div className= "card" key = {index}>
                    <div className= "card-inner" onClick = {this.handleClick}>
                        <div className = "card-front">
                            <img src={this.state.posterBaseURL + this.state.posterPath[index]} alt={this.state.films[index].title + " Movie Poster Image"} />
                        </div>
                        <div className = "card-back">
                            <h1>{ film.title }</h1>
                            <h2>{ film.original_title }</h2>
                            <h3>{ film.release_date }</h3>
                            <p>{ film.description }</p>
                        </div>
                    </div>
                </div>))
            }
        </main>);
    }
};