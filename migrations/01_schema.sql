DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id    SERIAL PRIMARY KEY NOT NULL,
  name  VARCHAR(255)       NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255)
);

DROP TABLE IF EXISTS properties CASCADE;
CREATE TABLE properties (
  id  SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  thumbnail_photo_url VARCHAR(255),
  cover_photo_url VARCHAR(255),
  cost_per_night INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  number_of_bathrooms INTEGER DEFAULT 0,
  number_of_bedrooms INTEGER DEFAULT 0,
  country VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(255),
  province VARCHAR(255),
  post_code VARCHAR(255),
  active BOOLEAN DEFAULT TRUE
);


DROP TABLE IF EXISTS reservations CASCADE;
CREATE TABLE reservations (
  id          SERIAL PRIMARY KEY NOT NULL,
  start_date  DATE,
  end_date    DATE,
  property_id INTEGER  REFERENCES properties(id) ON DELETE CASCADE,
  guest_id    INTEGER  REFERENCES users(id) ON DELETE CASCADE   
);

DROP TABLE IF EXISTS property_reviews CASCADE;
CREATE TABLE property_reviews (
  id             SERIAL PRIMARY KEY NOT NULL,
  guest_id       INTEGER  REFERENCES users(id)        ON DELETE CASCADE, 
  property_id    INTEGER  REFERENCES properties(id)   ON DELETE CASCADE,
  reservation_id INTEGER  REFERENCES reservations(id) ON DELETE CASCADE,  
  rating SMALLINT DEFAULT 0,
  message TEXT
);
