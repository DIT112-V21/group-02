
from connection import publisher


pub = Publisher()
topic = Topic()

pub.start()

pub.send(topic.test, "hello world!")