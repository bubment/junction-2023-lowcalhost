import string

import whisper


class SpeechTranscriptionService:
    translator = str.maketrans("", "", string.punctuation)

    def __init__(self):
        self.model = whisper.load_model("base")

    def generate_transcript(self, voice_sample_path: str) -> str:
        if not self.model:
            raise Exception("Model not loaded")

        options = {"language": "en", "task": "transcribe"}

        result = self.model.transcribe(voice_sample_path, **options)  # type: ignore

        return str(result["text"]).strip().lower().translate(self.translator)
