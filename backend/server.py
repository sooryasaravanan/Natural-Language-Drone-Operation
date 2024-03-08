from flask import Flask, Response, request, jsonify
from flask_cors import CORS
# import pygetwindow as gw
import pyautogui
import cv2
import openai
import subprocess
import numpy as np
import mss
import mss.tools
import time 
import base64 
import sys

from drone_detection.drone_detection import inference_on_image


# Set yourj OpenAI API key here
openai.api_key = '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'

app = Flask(__name__)
# Enable CORS for all domains on all routes
CORS(app)

x = "If the user says hackrf or info execute the check connection function"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    
    print("Received message from user:", user_input)
    
    # Example setup, adjust according to your actual setup
    functions = [
        {
            "name": "check_hackrf_connections",  # Ensure this matches the expected function call
            "description": "Check the HackRF device connection status",
            "parameters": {}
        }
    ]
    
    print("Defined functions for OpenAI API call.")
    
    try:
        openai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[
                {"role": "system", "content": "Function definitions here"},
                {"role": "user", "content": user_input},
            ],
            functions=functions,
            function_call="auto",
        )
        
        print("OpenAI API Response:", openai_response)
        
        function_name = openai_response['choices'][0]['message'].get('function_call', {}).get('name')
        
        if function_name:
            print("Function name from OpenAI response:", function_name)
            
            if function_name == "check_hackrf_connections":
                print("Executing 'check_hackrf_connections' based on OpenAI response.")
                # Directly call the function without making an HTTP request
                result = check_hackrf_connections()
                # Use jsonify to properly format the Python dictionary as a JSON response
                return jsonify(result)
            else:
                print("No matching function found.")
                response_text = "Function not recognized."
                return jsonify({"response": response_text})
        else:
            print("No function_call found in OpenAI response.")
            response_text = openai_response['choices'][0]['message'].get('content', 'No response generated.')
            return jsonify({"response": response_text})
        
    except Exception as e:
        print(f"An error occurred in /chat: {e}")
        return jsonify({"error": "Failed to process the request."}), 500
    
@app.route('/openai_chat', methods=['POST'])
def openai_chat():
    data = request.json
    user_input = data.get('message', '')

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "If the user says 'search the area' for drones say 'Searching...' or if the user says 'what was the mission result' say 'The mission was a success. A drone was spotted and neutrzlized.' If the user says to respoond in Ukrainian respond in ukrainian"},
                {"role": "user", "content": user_input},
            ],
        )
        
        openai_response = response.choices[0].message['content']
        
        # Note the adjusted response format to match front-end expectations
        return jsonify({"status": "success", "data": openai_response})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"status": "error", "message": "Failed to process your request."}), 500



def draw_compass(drone_directions, size=200):
    """
    Draws a compass with drone directions.
    
    Args:
    - drone_directions: A list of angles in degrees where each drone is detected.
                        0 degrees is North, 90 is East, etc.
    - size: Diameter of the compass.
    
    Returns:
    - A numpy array (image) of the compass.
    """
    compass_img = np.zeros((size, size, 3), dtype=np.uint8)
    center = (size // 2, size // 2)
    radius = size // 2 - 10  # Margin
    
    # Draw the compass circle
    cv2.circle(compass_img, center, radius, (255, 255, 255), 2)
    
    # Draw the N, E, S, W directions
    directions = {'N': (0, -1), 'E': (1, 0), 'S': (0, 1), 'W': (-1, 0)}
    for d, (dx, dy) in directions.items():
        cv2.putText(compass_img, d, (center[0] + dx * radius, center[1] + dy * radius + 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    
    # Draw drones on the compass
    for angle in drone_directions:
        # Convert degrees to radians and calculate point coordinates
        angle_rad = np.deg2rad(angle)
        x = int(center[0] + radius * np.cos(angle_rad))
        y = int(center[1] + radius * np.sin(angle_rad))
        cv2.circle(compass_img, (x, y), 5, (0, 0, 255), -1)  # Red dot for drone
    
    return compass_img

@app.route('/simulate_detections', methods=['GET'])
def simulate_detections():
    # Simulated drone directions
    drone_directions = [0, 45, 90, 135, 180, 225, 270, 315]
    
    # Generate the compass image with these directions
    compass_img = draw_compass(drone_directions)
    
    # Encode the image to a Base64 string
    _, buffer = cv2.imencode('.jpg', compass_img)
    compass_img_str = base64.b64encode(buffer).decode()
    
    return jsonify({"compassImage": compass_img_str})

@app.route('/generate_compass', methods=['POST'])
def generate_compass():
    data = request.json
    drone_directions = data.get('drone_directions', [])
    
    # Generate the compass image
    compass_img = draw_compass(drone_directions)
    
    # Encode the image to Base64 string
    _, buffer = cv2.imencode('.jpg', compass_img)
    compass_img_str = base64.b64encode(buffer).decode()

    return jsonify({"compassImage": compass_img_str})


def capture_screen_region(x, y, width, height):
    # Capture the specified screen area
    screenshot = pyautogui.screenshot(region=(x, y, width, height))
    # Convert the screenshot to an OpenCV format image
    frame = np.array(screenshot)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  # Convert colors from RGB to BGR
    return frame

def gen_frames():
    x, y, width, height = 0, 0, 1280, 720  # Adjust these values as needed
    fps = 150  # Desired frame rate
    frame_interval = 1.0 / fps  # Interval between frames in seconds

    while True:
        start_time = time.time()  # Start time of the loop iteration

        frame = capture_screen_region(x, y, width, height)
        if frame is not None:
            # Apply drone detection
            frame_with_detections = inference_on_image(frame)
            
            ret, buffer = cv2.imencode('.jpg', frame_with_detections)
            if not ret:
                continue  # If there's an error, skip this frame
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            # Handle the case where capturing fails
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + b'Error: Failed to capture screen region' + b'\r\n')

        end_time = time.time()  # End time of the loop iteration
        elapsed_time = end_time - start_time  # Calculate elapsed time in the loop
        time_to_wait = frame_interval - elapsed_time  # Calculate remaining time to wait

        if time_to_wait > 0:
            time.sleep(time_to_wait)  # Wait for the remainder of the frame interval

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    try:
        openai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Adjust the model name as needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_input},
            ]
        )
        response_text = openai_response['choices'][0]['message']['content']
        return jsonify({"response": response_text})
    except Exception as e:
        print(f"An error occurred in /chat: {e}")
        return jsonify({"error": "Failed to process the request."}), 500

from flask import jsonify

@app.route('/check_connection', methods=['POST'])
def check_hackrf_connection():
    print("hello")
    return jsonify({"message": "Connection check endpoint reached"}), 200

    
if __name__ == '__main__':
    app.run(debug=True, port=5001)
import base64