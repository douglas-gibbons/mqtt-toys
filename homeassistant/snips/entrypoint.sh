#!/bin/bash
set -e

ENABLE_HOTWORD_SERVICE=${ENABLE_HOTWORD_SERVICE:-yes}

#deploy apps (skills). See: https://snips.gitbook.io/documentation/console/deploying-your-skills
snips-template render

cd /var/lib/snips/skills
#start with a clear skill directory
rm -rf *
#download required skills from git
for url in $(awk '$1=="url:" {print $2}' /usr/share/snips/assistant/Snipsfile.yaml); do
	git clone $url
done

#run setup.sh for each skill.
find . -maxdepth 1 -type d -print0 | while IFS= read -r -d '' dir; do
  cd "$dir"
  if [ -f setup.sh ]; then
    echo "Run setup.sh in "$dir
    #run the scrips always with bash
    bash ./setup.sh
  fi
  cd /var/lib/snips/skills
done


cd /

# Automatic Speech Recognition service
snips-asr &
snips_asr_pid=$!

# Snips-dialogue service
snips-dialogue &
snips_dialogue_pid=$!

# Snips hotword service
snips-hotword &
snips_hotword_pid=$!

# Snips Natural Language Understanding service
snips-nlu &
snips_nlu_pid=$!

# Snips Skill service
snips-skill-server &
snips_skill_server_pid=$!

# Snips TTS service
snips-tts &
snips_tts_pid=$!

#audio server without playback and microphone
snips-audio-server &
snips_audio_server_pid=$!

# wait "$snips_asr_pid" "$snips_dialogue_pid" "$snips_hotword_pid" "$snips_nlu_pid" "$snips_skill_server_pid" "$snips_audio_server_pid"
snips-watch -vvv
