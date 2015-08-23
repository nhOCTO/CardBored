# BetterCanvas

A lightweight client for canvas LMS (City University of Hong Kong). 

Here "lightweight" means using least frameworks/plugins as possible. It's written in pure javascript (with jQuery) and HTML/CSS, 
and little bit PHP is also used to handle api requests as well as  encrypt user token. For higher speed, and also under limitation
of CityU's personal page, it doesn't use bootstrap, SQL or any other tools/frameworks.

Used https://github.com/gilfether/phpcrypt as there is no mcrypt module on CityU's personal page.

Currently it's under test and I'm not sure whether I can apply for a developer key succesfully, so it simply uses user-generated
access token...

I'm pretty sure this client is crude and maybe insecure since I only worked on this for about one week.
