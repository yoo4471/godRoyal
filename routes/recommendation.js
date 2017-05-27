// require the ger objects
var g = require('ger')

// Create an Event Store Manager (ESM) that stores events and provides functions to query them
var esm = new g.MemESM()

// Initialize GER with the esm
var ger = new g.GER(esm);

ger.initialize_namespace('movies')




ls = [
  {
    namespace: 'movies',
    person: 'bob',
    action: 'likes',
    thing: 'xmen',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'bob',
    action: 'likes',
    thing: 'avengers',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'bob',
    action: 'likes',
    thing: 'gun',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'bob',
    action: 'dislikes',
    thing: 'test',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'alice',
    action: 'likes',
    thing: 'xmen',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'alice',
    action: 'likes',
    thing: 'test',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'alice',
    action: 'likes',
    thing: 'gun',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'alice',
    action: 'likes',
    thing: 'avengers',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'dong',
    action: 'likes',
    thing: 'xmen',
    expires_at: '2020-06-06'
  },
  {
    namespace: 'movies',
    person: 'dong',
    action: 'likes',
    thing: 'avengers',
    expires_at: '2020-06-06'
  }
]

ger.events(ls)

a()
function a() {
  ger.recommendations_for_person('movies', 'dong', {actions: {likes: 1}, filter_previous_actions:['likes']})
  .then( function(recommendations) {
    console.log("\nRecommendations For 'alice'")
    console.log(JSON.stringify(recommendations,null,2))
  })

  ger.recommendations_for_thing('movies', 'xmen', {actions: {likes: 1}})
  .then( function(recommendations) {
    // console.log("\nRecommendations Like 'xmen'")
    // console.log(JSON.stringify(recommendations,null,2))
  })

}
