extends RichTextLabel

var start = false
var time = 0
var car_one
var car_two
var car_three
var time_elapsed
var playerText = ""
var greenText = ""
var yellowText = ""
var redText = ""
var playerFinished = false
var greenFinished = false
var yellowFinished = false
var redFinished = false
var statusText = ""

var laps: Dictionary = {
	"green": {
		"current": 0,
		"placement": "",
		"laps": {
			1: "",
			2: "",
		}
	},
	"yellow": {
		"current": 0,
		"placement": "",
		"laps": {
			1: "",
			2: "",
		}
	},
	"red": {
		"current": 0,
		"placement": "",
		"laps": {
			1: "",
			2: "",
		}
	},
	"player": {		
		"current": 0,
		"placement": "",
		"laps": {
			1: "",
			2: "",
		}
	}
}

# Called when the node enters the scene tree for the first time.
func _ready():
	time = 0
	car_one = $Bot/Ball.get_instance_id()
	car_two = $Bot2/Ball.get_instance_id()
	car_three = $Bot3/Ball.get_instance_id()

func get_time(time):
	var seconds = fmod(time,60)
	var minutes = fmod(time, 3600) / 60
	var elapsed = "%02d:%02d" % [minutes, seconds]
	return elapsed

func get_place(car):
	var n = 0
	if !laps["green"]["placement"] == "":
		n+=1
	if !laps["red"]["placement"] == "":
		n+=1
	if !laps["yellow"]["placement"] == "":
		n+=1
	if !laps["player"]["placement"] == "":
		n+=1
	
	if n == 0:
		laps[car]["placement"] = " 1st Place"
	elif n == 1:
		laps[car]["placement"] = " 2nd Place"
	elif n == 2:
		laps[car]["placement"] = " 3rd Place"
	else:
		laps[car]["placement"] = " 4th Place"
	
func _process(delta):
	if laps["green"]["current"] == 2 && laps["yellow"]["current"] == 2 && laps["red"]["current"] == 2 && laps["player"]["current"] == 2:
		start = false
	if start:
		time += delta
		
	if laps["green"]["current"] == 1:
		greenText = "Green Car Lap: " + str(laps["green"]["current"])  + "\n"
	elif laps["green"]["current"] == 2:
		if !greenFinished:
			get_place("green")
			greenFinished = true
		greenText = "Green Finish: " + str(laps["green"]["laps"][2]) + laps["green"]["placement"] +  "\n"
		$Bot.set_stop()
	else:
		greenText = ""
		
	if laps["yellow"]["current"] == 1:
		yellowText = "Yellow Car Lap: " + str(laps["yellow"]["current"])  + "\n"
	elif laps["yellow"]["current"] == 2:
		if !yellowFinished:
			get_place("yellow")
			yellowFinished = true
		yellowText = "Yellow Finish: " + str(laps["yellow"]["laps"][2]) + laps["yellow"]["placement"] + "\n"
		$Bot2.set_stop()
	else:
		yellowText = ""
		
	if laps["red"]["current"] == 1:
		redText = "Red Lap: " + str(laps["red"]["current"]) + "\n"
	elif laps["red"]["current"] == 2:
		if !redFinished:
			get_place("red")
			redFinished = true
		redText = "Red Finish: " + str(laps["red"]["laps"][laps["red"]["current"]]) + laps["red"]["placement"] + "\n"
		$Bot3.set_stop()
	else:
		redText = ""
		
	if laps["player"]["current"] == 1:
		playerText = "\nPlayer Lap: " + str(laps["player"]["current"]) + "\n"
	elif laps["player"]["current"] == 2:
		if !playerFinished:
			get_place("player")
			playerFinished = true
		playerText = "\nPlayer Finish: " + str(laps["player"]["laps"][laps["player"]["current"]]) + laps["player"]["placement"] + "\n"
	else:
		playerText = ""
		
	statusText = "Time: " + get_time(time) + "\n\n" + greenText + yellowText + redText + playerText
	set_text(statusText)
	
func _on_FinishLine_body_exited(body: Node) -> void:
	var name = ""
	if body.get_instance_id() == car_one:
		name = "green"
	elif body.get_instance_id() == car_two:
		name = "yellow"
	elif body.get_instance_id() == car_three:
		name = "red"
	else:
		name = "player"
	laps[name]["current"] += 1
	laps[name]["laps"][laps[name]["current"]] = get_time(time)

func _on_Timer_tree_exiting():
	start = true
