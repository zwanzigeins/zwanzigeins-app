mkdir zwanzigeins-pwa
cd zwanzigeins-pwa
npm i @bubblewrap/cli
npx bubblewrap init --manifest=https://zwanzigeins.jetzt/app/web-manifest.***.json

```
potentially set JAVA_HOME-variable in generated gradlew-file, e.g.
JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64/
```

npx bubblewrap.js build
