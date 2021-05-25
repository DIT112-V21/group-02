extends Node
var power = 600
onready var timer = $Timer
onready var label = $RichTextLabel
var available = true
var time = 5

func _input(ev):
	if ev is InputEventKey and ev.scancode == KEY_SPACE and not ev.echo and available:
		var direction= Vector3(0,0,-5) #example: direction in -z
		var global_direction = get_parent().global_transform.basis.xform(direction)
		get_parent().add_force(global_direction * power, Vector3(0,0,0))
		available = false
		timer.start()

func _ready():
	pass

func _process(delta):
	if !available:
		label.set_text("Nitro Cooldown: " + str(time))
	else:
		label.set_text("'Press Space' to Nitroboost")


func _on_Timer_timeout():
	time -=1
	if time == 0:
		time = 5
		available = true
		timer.stop()

