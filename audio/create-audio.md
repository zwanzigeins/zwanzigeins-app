Chrome-Sound aufnehmen mit Pipewire und in einzelne Zahl-Wörter aufteilen
=========================================================================

1. Datei audio-reader.html in Chrome öffnen

2. Chrome-Ausgabe-Target finden z.B.

id 85, type PipeWire:Interface:Node/3
 		object.serial = "10737"
 		factory.id = "6"
 		client.id = "51"
 		application.name = "Google Chrome"
 		node.name = "Google Chrome"
 		media.class = "Stream/Output/Audio"

pw-record --target 85 out.wav

sox out.wav output/audio-.wav silence 1 0.1 1% 1 0.4 0.2% : newfile : restart

