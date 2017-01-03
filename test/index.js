const assert = require('assert')
const main = require('../server.js')
const axios = require('axios')
const cheerio = require('cheerio')
const request = require('supertest');
let $


describe('Axios', function () {
  this.timeout(15000)
  describe('get()', function () {
    it('should get a string as part of response', function () {
      return axios.get('http://www.fandango.com/90210_movietimes')
        .then(function (response) {
          assert.equal(typeof response.data, 'string')
        })
    })
  })
})

describe('Browser request', function(){
  this.timeout(15000)
  before(
    function () {
      return axios.get('http://www.fandango.com/90210_movietimes')
      .then(function (response) {
        $ = cheerio.load(response.data)
        return response.data
      })
    }
  )

  describe('load', function(){
    it('return html as a string', function(){
      assert.equal(typeof $.html(), 'string')
    })
    it('has a title', function () {
      assert.equal($('title').text(), 'Movie Times and Movie Theaters in 90210- Local Showtimes - Fandango')
    })
    it('has .showtimes-theater', function () {
      assert(typeof $('.showtimes-theater').html() === 'string')
    })
    it('has length of .showtimes-theater as a number', function () {
      assert(typeof $('.showtimes-theater').length === 'number')
    })
  })

  describe('.showtimes-theater', function () {
    it('has .showtimes-theater-header', function () {
      assert(typeof $('.showtimes-theater')
        .find('.showtimes-theater-header')
        .text() === 'string')
    })
    it('has length of .showtimes-theater-header as a number', function () {
      assert(typeof $('.showtimes-theater')
        .find('.showtimes-theater-header')
        .length === 'number')
    })
    it('has .showtimes-movie-container', function () {
      assert(typeof $('.showtimes-theater')
        .find('.showtimes-movie-container')
        .text() === 'string')
    })
    it('has length of .showtimes-movie-container as a number', function () {
      assert(typeof $('.showtimes-theater')
        .find('.showtimes-movie-container')
        .length === 'number')
    })
  })

  describe('.showtimes-theater-header', function () {
    it('has .showtimes-theater-title', function () {
      assert(typeof $('showtimes-theater-header')
        .find('.showtimes-theater-title')
        .text() === 'string')
    })
    it('has length of .showtimes-theater-title as a number', function () {
      assert(typeof $('.showtimes-theater-header')
        .find('.showtimes-theater-title')
        .length === 'number')
    })
    it('has .showtimes-theater-address', function () {
      assert(typeof $('showtimes-theater-header')
        .find('.showtimes-theater-address')
        .text() === 'string')
    })
    it('has length of .showtimes-theater-address as a number', function () {
      assert(typeof $('.showtimes-theater-header')
        .find('.showtimes-theater-address')
        .length === 'number')
    })
  })

  describe('.showtimes-movie-container', function () {
    it('has .showtimes-movie-title', function () {
      assert(typeof $('.showtimes-movie-container')
        .find('.showtimes-movie-title')
        .text() === 'string')
    })
    it('\'s length of .showtimes-movie-title is > 0', function () {
      assert($('.showtimes-movie-container')
        .find('.showtimes-movie-title')
        .length > 0)
    })
    it('\'s length of .showtimes-movie-title is 1', function () {
        $('.showtimes-movie-container')
          .filter(function(idx, div) {
              return ($(div)
                .find('.showtimes-movie-title')
                .length === 1)
            })
          .each(function(idx, div) {
            assert.strictEqual( $(div)
              .find('.showtimes-movie-title')
              .length, 1)
          })
    })
    it('has .showtimes-movie-rating-runtime', function () {
      assert(typeof $('.showtimes-movie-container')
        .find('.showtimes-movie-rating-runtime')
        .text() === 'string')
    })
    it('\'s length of .showtimes-movie-rating-runtime is > 0', function () {
      assert($('.showtimes-movie-container')
        .find('.showtimes-movie-rating-runtime')
        .length > 0)
    })
    it('\'s length of .showtimes-movie-rating-runtime is 1', function () {
      $('.showtimes-movie-container')
        .filter(function(idx, div) {
            return ($(div)
              .find('.showtimes-movie-rating-runtime')
              .length === 1)
          })
        .each(function(idx, div) {
          assert.strictEqual( $(div)
            .find('.showtimes-movie-rating-runtime')
            .length, 1)
        })
    })
    it('has .showtimes-movie-genre', function () {
      assert(typeof $('.showtimes-movie-container')
        .find('.showtimes-movie-genre')
        .text() === 'string')
    })
    it('\'s length of .showtimes-movie-genre is > 0', function () {
      assert($('.showtimes-movie-container')
        .find('.showtimes-movie-genre')
        .length > 0)
    })
    it('\'s length of .showtimes-movie-genre is 1', function () {
      $('.showtimes-movie-container')
        .filter(function(idx, div) {
          return ($(div)
          .find('.showtimes-movie-genre')
          .length === 1)
        })
        .each(function(idx, div) {
          assert.strictEqual( $(div)
            .find('.showtimes-movie-genre')
            .length, 1)
        })
    })
    it('has "time" tag', function () {
      assert(typeof $('.showtimes-movie-container')
        .find('time')
        .text() === 'string')
    })
    it('\'s "time" tag length is > 0', function () {
      assert($('.showtimes-movie-container')
        .find('time')
        .length > 0)
    })
  })
})

describe('String manipulation', function(){
  describe('rating & runtime separation', function () {
    function splitRatingRuntime(str) {
        return {
          rating: str.split(' , ')[0],
          runtime: str.split(' , ')[1]
        }
    }
    function splitWithRegex(str){
      return {
        rating: str.match(/(Unrated|NC-17|PG-13|PG|G|R)*(\s*,\s*\W\s*\W)*\s*(\d{1,2}\shr(\s\d{1,2} min)*)*/)[1] || '',
        runtime: str.match(/(Unrated|NC-17|PG-13|PG|G|R)*(\s*,\s*\W\s*\W)*\s*(\d{1,2}\shr(\s\d{1,2} min)*)*/)[3] || ''
      }
    }
    it('creates an object with rating and runtime properties', function () {
      assert.deepStrictEqual(splitRatingRuntime('PG-13 , 1 hr 56 min'), {rating: 'PG-13', runtime: '1 hr 56 min'})
    })
    it('accounts for different combinations of ratings & runtimes', function () {
      assert.deepStrictEqual(splitWithRegex('PG-13 , ↵                                ↵                                2 hr 13 min'), {rating: 'PG-13', runtime: '2 hr 13 min'})
      assert.deepStrictEqual(splitWithRegex('PG-13'), {rating: 'PG-13', runtime: ''})
      assert.deepStrictEqual(splitWithRegex('1 hr 56 min'), {rating: '', runtime: '1 hr 56 min'})
      assert.deepStrictEqual(splitWithRegex('1 hr'), {rating: '', runtime: '1 hr'})
    })
  })
})

describe('/?zipCode=number', function () {
  let server
  const urlRoute = '/?zipCode=98104'

  beforeEach(function () {
    server = require('../server')
  })

  it('should give a json response',
    function (done) {
      request(server)
        .get(urlRoute)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    })

  it('should give the first 5 fandango results for that zip code',
    function (done) {
      request(server)
        .get(urlRoute)
        .expect(function (res) {
            if (res.body.length !== 5){
              res.body.map(function (el, idx){
                console.log(idx)
              })
              throw Error('There aren\'t exactly 5 results')
            }
        })
        .expect(200, done)
    })

  it('should have result objects that '
    + 'all have "theater", "address", and "movies" properties',
    function (done) {
      function checkProperties(obj) {
        return (obj.theater && obj.address && obj.movies)
      }
      function throwPropertiesError (res){
        if (!res.body.every(checkProperties)){
          throw Error('There is a missing property!')
        }
      }
      request(server)
        .get(urlRoute)
        .expect(throwPropertiesError)
        .expect(200, done)
    })

    afterEach(function () {
      server.close()
    })
})

describe('/?zipCode=number1&pg=number2', function () {
  let server
  const urlRoute = '/?zipCode=98104&pg=2'

  beforeEach(function () {
    server = require('../server')
  })

  it('should give a json response',
    function (done) {
      request(server)
      .get(urlRoute)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
    })

  it('should give a nonzero number of results',
    function (done) {
      request(server)
      .get(urlRoute)
      .expect(function (res) {
        if (res.body.length === 0){
          res.body.map(function (el, idx){
            console.log(idx)
          })
          throw Error('There are 0 results')
        }
      })
      .expect(200, done)
    })

    it('should have result objects that '
    + 'all have "theater", "address", and "movies" properties',
    function (done) {
      function checkProperties(obj) {
        return (obj.theater && obj.address && obj.movies)
      }
      function throwPropertiesError (res){
        if (!res.body.every(checkProperties)){
          throw Error('There is a missing property!')
        }
      }
      request(server)
      .get(urlRoute)
      .expect(throwPropertiesError)
      .expect(200, done)
    })

  afterEach(function () {
    server.close()
  })

})
