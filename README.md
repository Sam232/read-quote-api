# read-quote-api
A REST-API For A ReadQuote App.

This is a REST-API developed for a ReadQuote App. The API is live and can be accessed using this URL: https://calm-springs-53156.herokuapp.com/
All the HTTP REQUESTS for the REST-API are as follows:
1. Request for all quotes:
GET /quotes

2. Request a single quote:
GET /quotes/{{quoteID}}

3. Add a new quote:
POST /quotes 
The request body should include a title, type and a quote property.

4. Update a quote: 
PATCH /quotes/{{quoteID}}
The request body should include any or all of this; title, type, read(set to true/false) and a quote property. 

5. Delete a quote:
DELETE /quotes/{{quoteID}}

Thank You!!
