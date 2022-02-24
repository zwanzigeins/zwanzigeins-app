# Zwanzigeins-App

*Web-App zum Erproben der unverdrehten Zahlensprechweise.*

Da die Zielgruppe auf absehbare Zeit aus dem deutschen Sprachraum stammt, 
wählen wir **deutsch** als Sprache für das Projekt-Management und *Issues*.

In Quellcodes und anderen Entwickler-Dokumenten verwenden wir hingegen **englisch**.

Die App wird unter [https://zwanzigeins.jetzt/app](https://zwanzigeins.jetzt/app/) bereitgestellt.

## Project Introduction

This project is a static web-application based on JavaScript in version ES6. The
technological approach is very minimalist, no JS-framework, no real CSS-framework.
If you have some web-developing-experience, you should be able to get a good understanding 
of the entire source code quickly.


## Prerequisites

You need to install these programs into your operating system:

* Git (latest)
* NodeJS (version 8 or later)
* NPM (node package manager, version 4 or later)

Use a search-engine for details on installation.

After installation you should be able to call these commands from terminal:

```
git --version
node --version
npm --version
```

Now clone this repository, install the required *NodeJS*-dependencies and start the local webserver:

```
git clone https://github.com/zwanzigeins/zwanzigeins-app.git
cd zwanzigeins-app
npm install
npx ws
```

Point your browser to <http://localhost:8000/zwanzigeins-app.html>. You should see the 
Zwanzigeins-App in development mode. Any changes to source files should become directly visible on page-reload.
