FROM python:3.9.13

WORKDIR /app

ADD requirements.txt /app/
RUN pip install -r requirements.txt

RUN apt-get update
RUN apt-get install -y ffmpeg
COPY speaker_recognition /app/speaker_recognition
COPY db /app/db
COPY app.py /app/
ADD . /app
EXPOSE 5000
CMD ["python", "app.py"]

