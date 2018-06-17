/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`;
  }

  /**
   * Fetch all restaurants.
   */
   static fetchRestaurants(){
     return fetch("http://localhost:1337/restaurants")
      .then(callback => { 
      return callback.json();
      })
      .then(data => {
       return data;
      });
    }

  /**
   * Fetch a restaurant by its ID.
   */

    static fetchRestaurantById(id) {
      return DBHelper.fetchRestaurants()
      .then( data => {
          /*for(var i=0; i<data.length; i++){
            if(data[i].id == id){
              console.log("found: "+ data[i].name);
              return data[i];
              break;
            }else{
              console.log("not found");
            }
          }*/
         const results = data.filter(r => r.id==id );
         return results;
        })
    }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DBHelper.fetchRestaurants()
    .then (data => {
      /*for(var i=0; i<data.length; i++){
        console.log(data.length);
        console.log("checking: "+data[i].name);
        console.log("the cuisine is: "+data[i].cuisine_type+" and we search for: "+cuisine);
        if(data[i].cuisine_type==cuisine){
          results += data[i];
          console.log(results);
        }
      }*/
        const results = data.filter(r => r.cuisine_type == cuisine);
        for(var ris of results ){
          
        }
        return results;
        })
      
    }



  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then(data => {
        const results = data.filter(r => r.neighborhood == neighborhood);
        //return results;
        for(var ris in results){
          console.log(ris);
        }
      })
    }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then(data => {
        if (cuisine != 'all') { // filter by cuisine
          let results = data.filter(r => r.cuisine_type == cuisine);
          return results;
        }
        if (neighborhood != 'all') { // filter by neighborhood
          let results = data.filter(r => r.neighborhood == neighborhood);
          return results;
        }
        
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then (data => {
        // Get all neighborhoods from all restaurants
        const neighborhoods = data.map((v, i) => data[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants()
    .then(data => {
        // Get all cuisines from all restaurants
        const cuisines = data.map((v, i) => data[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    DBHelper.fetchRestaurants()
    .then(data => {
      for(var ris in data){
    const marker = new google.maps.Marker({
      position: ris.latlng,
      title: ris.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
    }
  })
  
 
}

}
