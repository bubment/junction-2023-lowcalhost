import os

from flask import Flask, jsonify, request

from db.user import User
from speaker_recognition.speaker_recognition import SpeakerRecognitionService
from speech_transcript.speech_transcript import SpeechTranscriptionService

app = Flask(__name__)

speaker_recognition = SpeakerRecognitionService()
transcribe_service = SpeechTranscriptionService()

_REQUEST_TMP_FILE_NAME = "tmp.mp3"
_USER_TMP_FILE_NAME = "tmp2.mp3"


@app.route("/verify", methods=["POST"])
def verify():
    voice_sample = request.files.get("voice_sample")
    username = request.form.get("username")

    if not voice_sample or not username:
        return "No voice sample provided", 400

    voice_sample.save(_REQUEST_TMP_FILE_NAME)
    user = User.get(username=username)
    open(_USER_TMP_FILE_NAME, "wb").write(user.voice_sample.tobytes())

    response = speaker_recognition.verify_voice_sample_for_user(_REQUEST_TMP_FILE_NAME, _USER_TMP_FILE_NAME)

    os.remove(_REQUEST_TMP_FILE_NAME)
    os.remove(_USER_TMP_FILE_NAME)

    return jsonify({"user_verified": response})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    voice_sample = request.files.get("voice_sample")

    if not voice_sample:
        return "No voice sample provided", 400

    voice_sample.save(_REQUEST_TMP_FILE_NAME)

    response = transcribe_service.generate_transcript(_REQUEST_TMP_FILE_NAME)

    os.remove(_REQUEST_TMP_FILE_NAME)

    return jsonify({"text": response})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
