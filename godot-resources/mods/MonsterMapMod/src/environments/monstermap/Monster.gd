extends KinematicBody

var player: WeakRef = weakref(null)
var move_speed = 10
onready var health = $HPbar
var hp = 100
var shake_amount = 1.0
	
func _ready():
	pass
	
func _process(delta):
	var lookfor = false
	move_speed += 0.01
	# you get the position of the enemy
	var enemy_origin = get_global_transform().origin
	# you get the position of the player
	var player_origin = get_global_transform().origin
	if (!player.get_ref()):
		pass
	else:
		lookfor = true
		player_origin = player.get_ref().get_global_transform().origin
	# when you subtract enemy from player, what you get is kind of like the _direction_ towards the player, which we will store in offset
	var offset = player_origin - enemy_origin
	# normalize offset so that it is a Vector of length 1
	# multiply by our move speed and by delta
	if lookfor:
		look_at(player_origin, Vector3(0,1,0)) 
		move_and_collide(offset.normalized() * move_speed * delta)


func _on_Area_body_entered(body: RigidBody):
	if body != null:
		player = weakref(body)


func _on_Gotcha_body_entered(body):
	if body != self:
		hp-=10
		health.update_healthbar(hp)
		move_speed = 10
		if body.has_method("_integrate_forces"):
			#var forcemult=30
			var forcemult = 1000
			var direction= Vector3(0,0,-5) #example: direction in -z
			var global_direction = body.global_transform.basis.xform(direction)
			body.add_force(global_direction * forcemult, Vector3(0,0,0))
	if hp == 0:
		var the_master = get_tree().get_root().get_node("/root/Master")
		the_master.load_profile(the_master.active_profile)	


func _on_Area_body_exited(body):
	pass
