extends Spatial

onready var viewport: Viewport = $MonsterCamera/Viewport


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

func _physics_process(delta):
	viewport.get_camera().global_transform.origin = global_transform.origin
	viewport.get_camera().global_transform.basis = global_transform.basis

