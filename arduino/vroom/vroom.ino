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

// smartcarlib::constants::motor::kMaxMotorSpeed = 200;

ArduinoRuntime arduinoRuntime;
BrushedMotor leftMotor(arduinoRuntime, smartcarlib::pins::v2::leftMotorPins);
BrushedMotor rightMotor(arduinoRuntime, smartcarlib::pins::v2::rightMotorPins);
DifferentialControl control(leftMotor, rightMotor);

GY50 gyroscope(arduinoRuntime, 37);

const auto pulsesPerMeter = 600;

DirectionlessOdometer leftOdometer{
    arduinoRuntime,
    smartcarlib::pins::v2::leftOdometerPin,
    []()
    { leftOdometer.update(); },
    pulsesPerMeter};
DirectionlessOdometer rightOdometer{
    arduinoRuntime,
    smartcarlib::pins::v2::rightOdometerPin,
    []()
    { rightOdometer.update(); },
    pulsesPerMeter};

//SimpleCar car(control);
SmartCar car(arduinoRuntime, control, gyroscope, leftOdometer, rightOdometer);

const auto oneSecond = 1000UL;
const auto safetyTime = 100UL;
const auto triggerPin = 6;
const auto echoPin = 7;
const auto maxDistance = 400;
const auto redFrontPin = 0;
const auto redRearPin = 3;

// safety variables
boolean allowForward = true;
boolean allowBackward = true;
boolean overrideAngle = false;
boolean overrideSpeed = false;
int carAngle = 0;
int safetySpeed = 0;

//Sensor Setup
SR04 front(arduinoRuntime, triggerPin, echoPin, maxDistance);
GP2D120 frontIR(arduinoRuntime, redFrontPin);
GP2D120 rearIR(arduinoRuntime, redRearPin);

std::vector<char> frameBuffer;

void setup()
{
    Serial.begin(9600);
#ifdef __SMCE__
    // int OV767X::begin(int resolution, int format, int fps)
    Camera.begin(VGA, RGB888, 60);
    frameBuffer.resize(Camera.width() * Camera.height() * Camera.bytesPerPixel());
    mqtt.begin("127.0.0.1", 1883, WiFi);
    // mqtt.begin(WiFi); // Will connect to localhost
#else
    mqtt.begin(net);
#endif
    if (mqtt.connect("arduino", "public", "public"))
    {
        mqtt.subscribe("/smartcar/control/#", 1);
        mqtt.onMessage(+[](String& topic, String& message) {
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
#ifdef __SMCE__
        static auto previousFrame = 0UL;
        if (currentTime - previousFrame >= 65)
        {
            previousFrame = currentTime;
            Camera.readFrame(frameBuffer.data());
            mqtt.publish("/smartcar/camera", frameBuffer.data(), frameBuffer.size(), false, 0);
        }
#endif
        obstacleDetection(currentTime);
    }
#ifdef __SMCE__
    // Avoid over-using the CPU if we are running in the emulator
    delay(35);
#endif
}
void handleInput(String topic, String message)
{
    int msg = msgToInt(message);

    if (topic == forward)
    {
        car.setSpeed(msg);
    }
    else if (topic == left || topic == right)
    {
        car.setAngle(msg);
        carAngle = msg;
    }
    else if (topic == reverse && allowBackward)
    {
        println("input ignored: " + topic + " " + message);
    }
}

// object dection implementation
void obstacleDetection(long currentTime)
{
    static auto previousCheck = 0UL;
    if (currentTime - previousCheck >= safetyTime)
    {
        previousCheck = currentTime;
        const auto sonicDistance = front.getDistance();
        //const auto IRdistance = String(frontIR.getMedianDistance()).toInt();
        const auto IRdistance = rearIR.getMedianDistance();
        if (checkSensor(sonicDistance, 200))
        {
            allowForward = false;
            autodriver();
            println("obstacle detected");
        }

        if (checkSensor(IRdistance, 15))
        {
            allowBackward = false;
        }
        else
        {
            allowBackward = true;
        }
    }
}

boolean checkSensor(int sensorData, int max)
{
    return (sensorData > 0 && sensorData < max);
}

void autodriver()
{
    unsigned int sonicDistance = front.getDistance();
    if (carAngle <= 0)
    {
        carAngle = carAngle + 60;
        car.setAngle(carAngle);
    }
    else
    {
        carAngle = carAngle - 60;
        car.setAngle(carAngle);
    }
    while (sonicDistance > 0 && sonicDistance < 200)
    {
        Serial.println("carangle : " + String(carAngle));
        car.setSpeed(40);
        sonicDistance = front.getDistance();
    }
    allowForward = true;
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