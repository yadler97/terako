# terako

terako is a discord bot that offers commands for searching animes and mangas via the anilist API, listening to YouTube videos in a voice channel, displaying current corona incidences in Germany and searching for articles on Wikipedia via the mediawiki API

## commands

\>ANIME \<name>  
\>MANGA \<name>  
\>ANIMELIST \<genre>  
\>PLAY \<url|search string>  
\>LEAVE  
\>WIKI \(\<keyword>)  
\>CORONA \(<city|county>|BL|IMPFUNGEN)  
\>GAME \<name>  
\>RANK  
\>HELP  

## env variables

| variable | description |
| --- | --- |
| DISCORD_TOKEN | the api token to connect the bot with discord |
| IGDB_CLIENT_ID | the client ID of your twitch application to connect to the IGDB api |
| IGDB_TOKEN | the token to connect to the IGDB api |
| MEDIAWIKI_URL | the url of the mediawiki the >wiki command should use, e.g. https://en.wikipedia.org/ |
| IS_HEROKU | defines if the bot is running on heroku |