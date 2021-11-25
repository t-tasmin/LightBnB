SELECT  properties.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating)
FROM reservations 
JOIN properties ON properties.id=reservations.property_id
JOIN property_reviews ON properties.id= property_reviews.property_id
WHERE reservations.guest_id=5 AND reservations.end_date < now()::date 
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;
