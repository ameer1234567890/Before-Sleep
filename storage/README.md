```
ffmpeg -i "concat:Silence.mp3|Shahadhat.mp3|Silence.mp3|Silence.mp3|Silence.mp3|Ayat-Al-Kursi.mp3|Silence.mp3|Silence.mp3|Silence.mp3|Ayat-Al-Noor.mp3|Silence.mp3|Silence.mp3|Silence.mp3|Amana-Rasool.mp3|Dua-Before-Sleep.mp3" -acodec copy Full1.mp3 && ffmpeg -i Full1.mp3 Full.mp3 && rm Full1.mp3
```