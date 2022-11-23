# Napkin

![Mockup](reference/landing.png)

## Directory Structure

- **database/** _(For database code.)_

- **reference/** _(For project reference.)_
  - reference/feed.pdf
  - reference/landing.png
  - reference/mockup.pdf
  - reference/requirements.txt
  - reference/tmp.http - vscode REST plugin commands for testing API calls

- **server/** _(For all server code.)_

- **website/** _(For all website code.)_ <- note to front end crew: I made a symlink from public_html to the website folder, so anything you put there will get served by Apache at cpsc.roanoke.edu/~napkin, not by Node. app.html is the starting point, and index.html is symlinked so it'll 'just work'.
  - website/index.html
  - website/style.css
  - website/script.js
  - **website/assets/** _(For all frontend assets.)_

## License
