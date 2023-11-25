FROM python:3.9.13

WORKDIR /app

COPY speaker_recognition /app/speaker_recognition
COPY db /app/db
COPY app.py /app/
ADD requirements.txt /app/
RUN pip install -r requirements.txt
ADD . /app
EXPOSE 5000
CMD ["python", "app.py"]

