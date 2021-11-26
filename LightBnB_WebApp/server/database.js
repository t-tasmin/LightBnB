const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
  SELECT * 
  FROM users
  where email =$1;
  `;
  const values = [email];
  return pool.query(queryString,values)
    .then((result) => { return result.rows[0] })
    .catch((err) =>   {console.log(err.message); });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT * 
  FROM users
  where id =$1;
  `;
  
  const values = [id];
  return pool.query(queryString,values)
    .then((result) => {return result.rows[0]})
    .catch((err) =>   {console.log(err.message); });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const name = user.name;
  const email = user.email;
  const password= user.password;

  const queryString = `
   INSERT INTO users (name, email, password)  VALUES($1, $2, $3)
   RETURNING *;
  `;
  const values = [name, email, password];

  return pool.query(queryString,values)
    .then((result) => {return result.rows[0]})
    .catch((err) =>   {console.log(err.message); });

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const queryString = `
   SELECT *
   FROM properties
   JOIN reservations
   ON properties.id = reservations.property_id
   WHERE guest_id=$1
   LIMIT $2;
  `;
  const values = [guest_id, limit];
  
  return pool.query(queryString,values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) =>   {console.log(err.message); });

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit) => {
    
    const queryParams = [];
    
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

   
    if (options.city) {

      if (queryParams.length > 0)
      {queryString += ` AND `;}
      else
      {queryString += ` WHERE `;}

      queryParams.push(`%${options.city}%`);
      queryString += ` city LIKE $${queryParams.length}`;
    }

    if (options.owner_id){

      if (queryParams.length > 0)
      {queryString += ` AND `;}
      else
      {queryString += ` WHERE `;}

      queryParams.push(Number(options.owner_id));
      queryString +=` owner_id=$${queryParams.length}`;
    }

    if (options.minimum_price_per_night && options.maximum_price_per_night){
      
      if (queryParams.length > 0)
      {queryString += ` AND `;}
      else
      {queryString += ` WHERE `;}
     
      queryParams.push(options.minimum_price_per_night);
      queryString += `properties.cost_per_night>$${queryParams.length}`;
      queryParams.push(options.maximum_price_per_night);
      queryString += ` AND properties.cost_per_night<$${queryParams.length}`;
    }
    
    if (options.minimum_rating){

      if (queryParams.length > 0)
      {queryString += ` AND `;}
      else
      {queryString += ` WHERE `;}

      queryParams.push(Number(options.minimum_rating));
      queryString += ` avg(property_reviews.rating) > $${queryParams.length}`;
    }

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    console.log(queryString, queryParams);

    return pool.query(queryString,queryParams)
    .then((result) => { return result.rows;})
    .catch((err) =>   {console.log(err.message); });
 };

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
 const addProperty = function(property) {
  return pool
    .query(`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
      street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;
    `, [
      parseInt(property.owner_id),
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      parseInt(property.cost_per_night),
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      parseInt(property.parking_spaces),
      parseInt(property.number_of_bathrooms),
      parseInt(property.number_of_bedrooms)
    ])
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};


exports.addProperty = addProperty;




