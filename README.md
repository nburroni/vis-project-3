# CS 424 Fall 2016 - Visualization & Visual Analytics 1 
## Project 3

### [Hosted Project](http://cs424-project3.s3-website-us-east-1.amazonaws.com/)

### Students
* [Federico Ruiz](https://github.com/fedex995)
* [Sergio Barajas](https://github.com/sbaraj5)
* [Nicolas Burroni](https://github.com/nburroni)

### The Data
For this project we visualize travel patterns in Orlando, comparing travel density between different holidays during the month of April, and showing points of interest in the area to relate to travel patterns.
### Dataset Type
The data represents a list enumerating the trips that took place for each day in the month of April of 2014. Each trip lists the origin and destination zones, the time of the day, and the type of trip it was.
#### Motivation & Audience
The audience is anyone who is interested in finding out travel patterns in Orlando, either to plan a trip, or to try and reduce traffic in congested areas during peak times. We find this is helpful to reduce the amount of traffic during holidays by planning ahead and finding out which are the most attended zones.

We wanted to create a visualization that would allow users to compare between different holidays or average days of the month, overlaying points of interest such as attractions or churches. We intend to answer questions such as: 
* "Should I expect more people to travel to this particular area where a church is located during Easter?"
* "There is a long weekend coming up. Does Disney World tend to get too crowded on long weekends?"
* "Is it more convenient to go to a mall during the week or during the weekend?".

#### Datasets
We used three different datasets for this project.  
##### Orlando Metropolitan Area Travel Data
This dataset provided all of the trips for each day of the month of April 2014, listing the origin and destination zones, the time of the day, and the type of trip it was. This was the main, and largest, dataset of this visualization.

##### Supplemental Holiday Data
This dataset provided information about holidays in the US during the month of April 2014.

##### Supplemental Points of Interest Data
We used Google Maps API to perform search based on terms such as "attractions", "catholic churches", "jewish temples" and "malls", which provided us with the results shown with markers.

### The Visualization
![Dashboard](samples/general1.png)

#### [Click to watch video](https://youtu.be/8gy5Otlwdjo)
[![Project Video](https://img.youtube.com/vi/8gy5Otlwdjo/0.jpg)](https://youtu.be/8gy5Otlwdjo)

This map can provide a high-level overview of inbound or outbound density per zone
![Map Full Inbound](samples/map-1.png)
![Map Full Outbound](samples/map-2.png)

The user can zoom in to see the zones with more detail
![Map Zoom](samples/map-3.png)

The user can click on a zone to get information about the amount of trips from or to other zones
![Map Click Inbound](samples/map-4.png)
![Map Click Outbound](samples/map-5.png)

The user can add to up to four maps to compare data
![Map Add](samples/map-6.png)

#### Visualization Tasks
##### Analyze
Our visualization achieves the task of analyzing the data. More in particular, the user can consume the data shown in the visualizations. This data already existed, but it was processed so the user can discover, present or enjoy. He/she may be interested in showing people the actual panorama of flight delays, or it may be in his/her interest to analyze the data in order to know more about a yet not understood aspect of flight itineraries. 
##### Discover
Users can discover new information, mainly through the week and weather visualizations. For example, if wanting to prove a theory which states that flights in the afternoon usually get more delays, the week visualization would help to discover that that theory is true.
##### Present
A user may want to present to others something already known. For example, using the link map visualization, the user may present to others all the connections between cities. It’s important to say that in this case, the knowledge communicated is already known by the recipient. Interaction is also important while presenting the data. The user may hover over an airport in order to emphasize on the links of that particular airport.
##### Enjoy
Users that don’t form part of the target audience can enjoy the visualization. Many people, although they don’t have any discovering or presenting purpose while using the vis, can use it simply to learn about the US flight system, or just play around with the flights. 
##### Lookup
This task may be one of the most influential in our visualizations. If a user already knows which airport he/she wants to look into, they just have to remember where it is located geographically, and will get all the delay information from there.
##### Derive
In order to make the week visualization, we had to go over some transformations over the dataset. We went from a list of flights to the delays depending of the hour and the day of the week. This shows a clear derivation from the original data. The same can be seen in the weather visualization, where the average weather delay was calculated using the list of flights, and then displayed using a color scale.
##### Browse
In other cases, the user doesn’t know exactly what he/she wants. Keeping up with the last example, the user may use the airport filter in order to see in the map only the selected airports. 
##### Compare
By selecting different month options, the user can compare between them. This has only one disadvantage, and is the fact that the two visualizations can’t be seen simultaneously. The user can also compare delays and weather events by hovering on the week’s visualization hours. This also gives the ability to compare between different times of the day, and also between different days of the week. 
Another clear example of comparison can be seen in the weather visualization. Here, the user can compare the relation between weather events like tornadoes or lightning, and the delay airports experience at the same time. 
##### Summarize
These visualizations include highly dense data-sets, so we had to make sure that we didn’t go too specific in the data we were showing, in order to grant the user the possibility to give an overview of the situation. This is why we made averages of the data monthly, so the user can get general insight for every month. Nevertheless, we left friendly interactions for the user to quickly filter the data shown and get more detailed results.
#### Interactive Techniques
##### Animation
We include animations on load and when the user hovers or clicks on items to provide a smooth experience
##### Select Elements
The user may select airports or different hours to visualize those selected in specific. Hovering also removes clutter and focuses the view on what the user is hovering over by highlighting related items.
##### Navigate
The user can zoom and pan the map visualizations to provide greater detail. The user is unconstrained as in they can zoom and pan freely on the maps.


### How To Run
#### 1. Download the project source code
Either clone the project, or download it manually and extract it.

#### 2. Open a Terminal and run your favorite server
We developed this project using python's server functionality, so for best results we recommend using the same.
```bash
$ cd /path/to/source-code
$ python -m SimpleHTTPServer <port>
```

#### 3. Fire up Chrome (yes, please use Chrome)
We kindly ask for you to use Chrome, which is what we used while developing, and where we got the best results. Open it, and navigate to `http://localhost:<port>/`

#### 4. You're all set!
You can now explore the visualization dashboard.

### Who Did What
* [Federico Ruiz](https://github.com/fedex995)
  * Routes between zones
  * Google Maps API Directions request handling

* [Sergio Barajas](https://github.com/sbaraj5)
  * Zone polygon rendering
  * Zone click and different color scale functionality

* [Nicolas Burroni](https://github.com/nburroni)
  * Data filtering, mapping and reducing
  * Points of interest overlay
  * Multi-map visualization
