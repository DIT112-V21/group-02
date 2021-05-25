extends RichTextLabel

export var countdown_seconds = 5
var start = false
onready var timer = $Timer

func _ready():
	pass
	
func _process(delta):
	if start:
		if countdown_seconds > 0:
			set_text(" "+str(countdown_seconds))
		else:
			set_text("Go!")

func _on_Timer_timeout():
	if countdown_seconds > 0:
		countdown_seconds-=1
	else:
		queue_free()


func _on_Area_body_entered(body):
	start = true
	timer.start()
