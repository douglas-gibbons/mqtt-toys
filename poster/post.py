import argparse
import paho.mqtt.client as mqtt
import yaml
import json

parser = argparse.ArgumentParser(description='Post MQTT messages')
parser.add_argument('--file', required=True,
                    help='YAML file of messages to post')
parser.add_argument('--broker', required=True, help='Broker hostname')

args = parser.parse_args()

client = mqtt.Client("poster")
client.connect(args.broker)

with open(args.file, 'r') as stream:
    data = yaml.safe_load(stream)
    for item in data:
        print(item["topic"])

        # Set some defaults
        if not "qos" in item: item["qos"] = 0
        if not "retain" in item: item["retain"] = False
        if not "message" in item: item["message"] = "{}"

        # Publish the message
        client.publish(item["topic"], payload=json.dumps(item["message"]), qos=item["qos"], retain=item["retain"])
