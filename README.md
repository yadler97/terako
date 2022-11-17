# terako

terako is a discord bot that offers commands for searching animes and mangas via the anilist API, listening to YouTube videos in a voice channel, displaying current corona incidences in Germany, searching for articles on Wikipedia via the Mediawiki API and searching for images and translating texts via the Bing API.

## commands

/ANIME \<name>  
/MANGA \<name>  
/ANIMELIST \<genre>  
/PLAY \<url|search string>  
/LEAVE  
/WIKI \(\<keyword>)  
/CORONA \(<city|county>)  
/CORONASTATE  
/GAME \<name>  
/UPCOMING \(\<platform>)  
/TRANSLATE \<language abbreviation> \<text>  
/LANGUAGELIST  
/IMAGE \<search term>  
/CONVERT \<input currency> \<output currency> \<value>  
/TRAIN \<origin> \<destination>  
/DEPARTURE \<station>  
/ARRIVAL \<station>  
/RANK  

## env variables

| variable | description |
| --- | --- |
| DISCORD_TOKEN | the api token to connect the bot with discord |
| DISCORD_CLIENT_ID | client id of the discord bot |
| IGDB_CLIENT_ID | the client ID of your twitch application to connect to the IGDB api |
| IGDB_TOKEN | the token to connect to the IGDB api |
| MEDIAWIKI_URL | the url of the mediawiki the >wiki command should use, e.g. https://en.wikipedia.org/ |
| BING_KEY | the key for the azure bing web search service |
| IS_HEROKU | defines if the bot is running on heroku |