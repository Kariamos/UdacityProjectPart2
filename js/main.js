let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 *Fetch all neighborhoods and set their HTML.
 */


fetchNeighborhoods = () => {
        //let neighborhoods = new Array();
        neighborhoods = DBHelper.fetchNeighborhoods()
        .then( neighborhoods => {
        self.neighborhoods = neighborhoods;
        //console.log(self.neighborhoods);
        fillNeighborhoodsHTML( self.neighborhoods);
    })
  }

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  console.log(self.neighborhoods);
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines()
  .then( cuisines => {
      self.cuisines = cuisines;
      fillCuisinesHTML(self.cuisines);
    });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');
  console.log(cuisines);
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
  .then(data => {
      for(var restaurant in data){
      resetRestaurants(restaurant);
      fillRestaurantsHTML(restaurant);
    }
})
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  for(var res in restaurants) {
    ul.append(createRestaurantHTML(res));
  }
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.setAttribute("tabindex","0");
  image.setAttribute("aria-label","Restaurant image");
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  const mediumImage = DBHelper.imageUrlForRestaurant(restaurant).replace(".jpg","-medium.jpg");
  const smallImage = DBHelper.imageUrlForRestaurant(restaurant).replace(".jpg","-small.jpg");
  image.setAttribute("srcset", mediumImage+" 400w,"+DBHelper.imageUrlForRestaurant(restaurant)+" 800w,"+smallImage+" 200w");
  image.setAttribute("alt",`Image for the restaurant ${restaurant.name}`);
  
  li.append(image);

  const name = document.createElement('h2');
  name.setAttribute("tabindex","0");
  name.setAttribute("aria-label","Restaurant name: "+restaurant.name);
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.setAttribute("tabindex","0");
  neighborhood.setAttribute("aria-label","Restaurant neighborhood: "+restaurant.neighborhood);
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.setAttribute("tabindex","0");
  address.setAttribute("aria-label","Restaurant address: "+restaurant.address);
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  for( var rest in restaurants){
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(rest, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  }
}
