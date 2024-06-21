import os
import pyaudio
import wave
import requests
import json
import keyboard
from dotenv import load_dotenv
from typing import IO
from io import BytesIO
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from groq import Groq
import arabic_reshaper
from bidi.algorithm import get_display

load_dotenv()

SPEECH_TO_TEXT_API_KEY = os.getenv("SPEECH_TO_TEXT_API_KEY")
LANGUAGE_MODEL_API_KEY = os.getenv("LANGUAGE_MODEL_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

groq_client = Groq(api_key=LANGUAGE_MODEL_API_KEY)
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def format_arabic_text(text):
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)
    return bidi_text

def record_audio():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 44100

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    print("Press and hold the space bar to record...")
    frames = []

    while True:
        if keyboard.is_pressed('space'):
            data = stream.read(CHUNK)
            frames.append(data)
        elif len(frames) > 0:
            break

    print("Recording stopped.")

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open("input.wav", 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

def transcribe_audio(audio_file):
    url = "https://api.groq.com/openai/v1/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {SPEECH_TO_TEXT_API_KEY}"
    }
    with open(audio_file, "rb") as file:
        files = {
            "file": file,
            "model": (None, "whisper-large-v3")
        }
        data = {
            "response_format": "json",
            "language": "ar",  # Set to Arabic
            "temperature": 0.2
        }

        response = requests.post(url, headers=headers, files=files, data=data)
    response.raise_for_status()
    return response.json()["text"]

def process_with_llm(text):
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "you must respond in the arabic language and nothning"
                },    
                {
                    "role": "user",
                    "content": text
                }
            ],
            model="llama3-8b-8192",
        )
        
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error in language model processing: {str(e)}")
        return None

def text_to_speech(text: str) -> IO[bytes]:
    try:
        response = elevenlabs_client.text_to_speech.convert(
            voice_id="21m00Tcm4TlvDq8ikWAM",
            optimize_streaming_latency="0",
            output_format="mp3_22050_32",
            text=text,
            model_id="eleven_multilingual_v2",
            voice_settings=VoiceSettings(
                stability=0.5,
                similarity_boost=0.5,
                use_speaker_boost=True,
            ),
        )

        audio_stream = BytesIO()

        for chunk in response:
            if chunk:
                audio_stream.write(chunk)

        audio_stream.seek(0)

        # Save the audio stream to a file
        with open("output.mp3", "wb") as f:
            f.write(audio_stream.getvalue())

        print("Speech output saved as 'output.mp3'")

        return audio_stream
    except Exception as e:
        print(f"Error in text-to-speech conversion: {str(e)}")
        return None

def main():
    try:
        print("Recording audio...")
        record_audio()

        print("Transcribing audio...")
        transcribed_text = transcribe_audio("input.wav")
        formatted_text = format_arabic_text(transcribed_text)
        print(f"Transcribed text: {formatted_text}")

        print("Processing with language model...")
        processed_text = process_with_llm(transcribed_text)  # Use original text for processing
        if processed_text:
            formatted_processed_text = format_arabic_text(processed_text)
            print(f"Processed text: {formatted_processed_text}")

            print("Converting text to speech...")
            audio_stream = text_to_speech(processed_text)  # Use original text for TTS
            if audio_stream:
                print("Speech output saved as 'output.mp3'")
            else:
                print("Failed to convert text to speech.")
        else:
            print("Failed to process text with language model.")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    print("Speech-to-Speech System")
    print("Press and hold the space bar to record, release to stop.")
    main()