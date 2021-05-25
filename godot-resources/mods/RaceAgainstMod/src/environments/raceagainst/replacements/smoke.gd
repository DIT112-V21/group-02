extends Spatial


onready var ray = $smoke/RayCast
onready var ray2 = $smoke/RayCast2
onready var ray3 = $smoke/RayCast3


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):

	if ray.is_colliding() or ray2.is_colliding() or ray3.is_colliding() :
		$smoke/Smoke.emitting = true
		$smoke/Smoke2.emitting = true
	else:
		$smoke/Smoke.emitting = false
		$smoke/Smoke2.emitting = false
