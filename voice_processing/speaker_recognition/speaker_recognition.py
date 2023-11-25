from speechbrain.pretrained import SpeakerRecognition


class SpeakerRecognitionService:
    def __init__(self):
        self.model = SpeakerRecognition.from_hparams(
            source="speechbrain/spkrec-resnet-voxceleb", savedir="pretrained_models/spkrec-resnet-voxceleb"
        )

    def verify_voice_sample_for_user(self, voice_sample_path_1: str, voice_sample_path_2: str) -> bool:
        if not self.model:
            raise Exception("Model not loaded")

        score, prediction = self.model.verify_files(voice_sample_path_1, voice_sample_path_2)

        # implement a treshold?

        return bool(prediction)
