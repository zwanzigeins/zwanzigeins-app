Chrome-Sound aufnehmen mit Pipewire und in einzelne Zahl-Wörter aufteilen
=========================================================================

1. Datei audio-reader.html in Chrome öffnen

2. pw-record --target "Google Chrome" out.wav

3. sox out.wav audio-.wav silence 1 0.05 1% 1 0.1 0.1% : newfile : restart

//optional
// bass-boost
for i in audio*.wav; do sox "$i" ../wav-processed/"$i" bass +12 norm; done

// fade-in
for i in audio*.wav; do sox "$i" ../wav-faded/"$i" fade q 0.02; done

//mp3-conversion
for i in *.wav; do lame -V4 "$i" ../mp3/"`basename "$i" .wav`".mp3; done

//aac-conversion
for i in *.wav; do ffmpeg -i "$i" -c:a aac -b:a 128k ../m4a/"`basename "$i" .wav`".m4a; done

