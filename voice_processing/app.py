import os

from flask import Flask, jsonify, request

from db.user import User
from speaker_recognition.speaker_recognition import SpeakerRecognitionService
from speech_transcript.speech_transcript import SpeechTranscriptionService

app = Flask(__name__)

speaker_recognition = SpeakerRecognitionService()
transcribe_service = SpeechTranscriptionService()

_REQUEST_TMP_FILE_NAME = "tmp.wav"
_USER_TMP_FILE_NAME = "tmp2.wav"

_DIGIT_TO_WORD = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "for",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
}


@app.route("/verify", methods=["POST"])
def verify():
    username = request.form.get("username")

    if not username:
        return "No username provided", 400

    user = User.get(username=username)
    final_filename_req = f"{username}{_REQUEST_TMP_FILE_NAME}.wav"
    final_filename_user = f"{username}{_USER_TMP_FILE_NAME}.wav"
    open(final_filename_req, "wb").write(user.verification_sample.tobytes())
    open(final_filename_user, "wb").write(user.voice_sample.tobytes())

    response = speaker_recognition.verify_voice_sample_for_user(final_filename_req, final_filename_user)

    os.remove(final_filename_req)
    os.remove(final_filename_user)

    print(response)

    return jsonify({"user_verified": response})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    username = request.form.get("username")

    if not username:
        return "No username provided", 400

    user = User.get(username=username)
    final_filename = f"{username}{_REQUEST_TMP_FILE_NAME}.wav"
    open(final_filename, "wb").write(user.verification_sample.tobytes())

    response = transcribe_service.generate_transcript(final_filename)

    os.remove(final_filename)
    try:
        response = _DIGIT_TO_WORD[str(response)]
    except KeyError:
        pass

    print(response)

    return jsonify({"text": response})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
