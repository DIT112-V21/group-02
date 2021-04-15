#if defined(__has_include) && __has_include("./secrets.hpp")
#include "./secrets.hpp"
#else
#include "./secrets-defaults.hpp"
#endif
#include "./topics.hpp"
#include <vector>
#include <MQTT.h>
#include <WiFi.h>

#ifdef __SMCE__
#include <OV767X.h>
#endif

#include <Smartcar.h>

#ifndef __SMCE__
WiFiClient net;
#endif
MQTTClient mqtt;



ArduinoRuntime arduinoRuntime;
BrushedMotor leftMotor(arduinoRuntime, smartcarlib::pins::v2::leftMotorPins);
BrushedMotor rightMotor(arduinoRuntime, smartcarlib::pins::v2::rightMotorPins);
DifferentialControl control(leftMotor, rightMotor);

SimpleCar car(control);





ArduinoRuntime arduinoRuntime1;
BrushedMotor leftMotor1(arduinoRuntime, smartcarlib::pins::v2::leftMotorPins);
BrushedMotor rightMotor1(arduinoRuntime, smartcarlib::pins::v2::rightMotorPins);
DifferentialControl control1(leftMotor, rightMotor);

SimpleCar car1(control1);

const auto oneSecond = 1000UL;
const auto safetyTime = 100UL;
const auto triggerPin = 6;
const auto echoPin = 7;
const auto maxDistance = 400;
const auto redFrontPin = 0;

// safety variables
boolean allowForward = true;
int safetySpeed = 0;

SR04 front(arduinoRuntime, triggerPin, echoPin, maxDistance);
GP2D120 frontIR(arduinoRuntime, redFrontPin);

std::vector<char> frameBuffer;

void setup()
{
    Serial.begin(9600);
    car1.setSpeed(50);
#ifdef __SMCE__
    Camera.begin(QVGA, RGB888, 15);
    frameBuffer.resize(Camera.width() * Camera.height() * Camera.bytesPerPixel());
    mqtt.begin(ip, port, WiFi);
#else
    mqtt.begin(net);
#endif
    if (mqtt.connect("arduino", user, pass))
    {
        mqtt.subscribe("/smartcar/control/#", 1);
        mqtt.onMessage([](String topic, String message) {
            handleInput(topic, message);
        });
    }
}

void loop()
{
    if (connected())
    {
        mqtt.loop();
        const auto currentTime = millis();
        obstacleDetection(currentTime);
        cameraFeed(currentTime);
    }
#ifdef __SMCE__
    // Avoid over-using the CPU if we are running in the emulator
    delay(35);
#endif
}

void cameraFeed(long currentTime){
    static auto previousFrame = 0UL;
    if (currentTime - previousFrame >= 100) {
      previousFrame = currentTime;
      Camera.readFrame(frameBuffer.data());
      mqtt.publish("/smartcar/camera", frameBuffer.data(), frameBuffer.size(),
                   false, 0);
        println(frameBuffer.)
     }
   }

void handleInput(String topic, String message)
{
    int msg = msgToInt(message);
    if (topic == forward && allowForward)
    {
        car.setSpeed(msg);
    }
    else if (topic == reverse)
    {
        car.setSpeed(msg);
    }
    else if (topic == left)
    {
        car.setAngle(msg);
    }
    else if (topic == right)
    {
        car.setAngle(msg);
    }
    else
    {
        println("imput ignored: " + topic + " " + message);
    }
}

// object dection implementation
void obstacleDetection(long currentTime)
{
    static auto previousCheck = 0UL;
    if (currentTime - previousCheck >= safetyTime)
    {
        previousCheck = currentTime;
        const auto sonicDistance = String(front.getDistance()).toInt();
        const auto IRdistance = String(frontIR.getMedianDistance()).toInt();
        if (checkSensor(sonicDistance, 200))
        {
            if (allowForward)
            {
                allowForward = false;
                speed(0);
            }
        }
        else
        {
            allowForward = true;
        }
    }
}

boolean checkSensor(int sensorData, int max)
{
    return (0 < sensorData && sensorData < max);
}

int msgToInt(String msg)
{
    return msg.toInt();
}

void println(String msg)
{
    Serial.println(msg);
}

boolean connected()
{
    return mqtt.connected();
}

void speed(int speed)
{
    car.setSpeed(speed);
}