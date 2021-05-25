extends Node


func _ready():
	pass 

#func _process(delta):
#	pass

func _on_Area_body_entered(body: Node):
	if body.has_method("_integrate_forces"):
		#var forcemult=30
		var forcemult = 1000
		var direction= Vector3(0,0,-5) #example: direction in -z
		var global_direction = body.global_transform.basis.xform(direction)
		body.add_force(global_direction * forcemult, Vector3(0,0,0))
		#for wheel in body._rightw:
		#	wheel.spring_force = 100
		#for wheel in body._leftw:
		#	wheel.spring_force = 100
