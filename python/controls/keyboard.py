from pynput.keyboard import Key, Listener
from connection import connecter, Topic
import os
import sys
dir_path = os.path.dirname(os.path.realpath(__file__))
parent_dir_path = os.path.abspath(os.path.join(dir_path, os.pardir))
sys.path.insert(0, parent_dir_path)

IDLE = 0
STRAIGHT = 0
VELOCITY = 200
DIRECTION = 35
MQTT = connecter.create("Car")
TOPIC = Topic()


class Keyboard:
    def __init__(self):
        self.up = False
        self.down = False
        self.left = False
        self.right = False
        self.listener = Listener(
            on_press=self.on_press, on_release=self.on_release)
        self.listener.start()

    def on_press(self, key):
        if key is Key.up:
            if self.up is False:
                self.up = True
                MQTT.publish(TOPIC.throttle_forward, VELOCITY)
        if key is Key.down:
            if self.down is False:
                self.down = True
                MQTT.publish(TOPIC.throttle_reverse, -VELOCITY)
        if key is Key.right:
            if self.right is False:
                self.right = True
                MQTT.publish(TOPIC.steering_right, DIRECTION)
        if key is Key.left:
            if self.left is False:
                self.left = True
                MQTT.publish(TOPIC.steering_left, -DIRECTION)

    def on_release(self, key):
        if key is Key.up:
            self.up = False
            MQTT.publish(TOPIC.throttle_forward, IDLE)
        if key is Key.down:
            self.down = False
            MQTT.publish(TOPIC.throttle_reverse, IDLE)
        if key is Key.right:
            self.right = False
            MQTT.publish(TOPIC.steering_right, STRAIGHT)
        if key is Key.left:
            self.left = False
            MQTT.publish(TOPIC.steering_left, STRAIGHT)
