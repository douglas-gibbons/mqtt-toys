Simple script to post multiple messages to an MQTT broker.

Example usage:

```
python3 post.py --file=./example.yaml --broker=broker.local
```

See [example.yaml](example.yaml) for an example input file. This takes YAML as input, but outputs the payload in JSON format. Seems strange, but YAML is easier for humans, and JSON is more common for MQTT payloads.

For example, YAML such as this:

```
- topic: my/topic/example
  qos: 1
  retain: true
  message:
    field1: value1
    field2: value2
```

Would post a retained message to topic "my/topic/example" and a payload like this:
```
{"field1":"value1","field2":"value2"}
```
