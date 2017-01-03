const cheerio = require('cheerio')
const axios = require('axios')
const zipCode = process.argv[2] || 98104
const express = require('express')
const http = require('http')

const app = express()

app.set('port', process.env.PORT || 3000)

// Middleware goes here

// Routes go here
const splitWithRegex = (idx, {title, rating_runtime, genre, times}) => {
  return {
    rating: rating_runtime.match(/(Unrated|NC-17|PG-13|PG|G|R)*(\s*,\s*\W\s*\W)*\s*(\d{1,2}\shr(\s\d{1,2} min)*)*/)[1] || '',
    runtime: rating_runtime.match(/(Unrated|NC-17|PG-13|PG|G|R)*(\s*,\s*\W\s*\W)*\s*(\d{1,2}\shr(\s\d{1,2} min)*)*/)[3] || '',
    title,
    genre,
    times
  }
}

processHTML = $ => {
  return $('.showtimes-theater')
    .has('.showtimes-movie-title')
    .map(getTheaters($)).get()
}

function getTheaters(loadedHTML){
  return (idx, theater) => {
    return {
      theater: loadedHTML(theater)
      .find('.showtimes-theater-title')
      .text()
      .trim(),
      address: loadedHTML(theater)
      .find('.showtimes-theater-address')
      .text()
      .trim(),
      movies: loadedHTML(theater)
      .find('.showtimes-movie-container')
      .map(getMovies(loadedHTML))
      .map(splitWithRegex).get()
    }
  }
}

function getMovies(loadedHTML){
  return function (idx, movie){
    return {
      title: loadedHTML(movie).find('.showtimes-movie-title').text().trim(),
      rating_runtime: loadedHTML(movie).find('.showtimes-movie-rating-runtime').text().trim(),
      genre: loadedHTML(movie).find('.showtimes-movie-genre').text().trim(),
      times: loadedHTML(movie)
      .find('time')
      .map((idx, time) => loadedHTML(time).text()).get()
    }
  }
}

const getShowtimes = (req, res) => {
  return axios.get(`http://www.fandango.com/${req.query.zipCode || zipCode}_movietimes${req.query.pg ? ('\?pn=' + req.query.pg) : ''}`)
  .then(function (response) {
    return cheerio.load(response.data)
  })
  .then(processHTML)
  .then(jsonData => {
    res.send(jsonData)
  })
}

const getMoviesInTheaters = (req, res) => {
  
}

app.get('/', getShowtimes)

const server = app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:%d',  app.get('port'))
})

module.exports = server
