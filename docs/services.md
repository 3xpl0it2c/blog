# Services.
  
## What are services ?
Services as obvious as it sounds are just a way for the app to communicate with the outer world.  
For example, a logger is considered a service and so does a database driver.  
But a validator of some sort is not a service. (Maybe if it calls an outer server, then it is a service)  
  
## What use does the app makes of services ?
All the services are initiated and injected into the app context at "boot time".  
And then when in need the functions inject the services to the repositories via currying (Dependency Injection).  
  

