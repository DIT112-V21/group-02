extends Spatial

onready var ball = $Ball
onready var car_mesh = $CarMesh
onready var ground_ray = $CarMesh/RayCast
# mesh references
onready var right_wheel = $CarMesh/tmpParent/Car/wheel_frontRight
onready var left_wheel = $CarMesh/tmpParent/Car/wheel_frontLeft
onready var body_mesh = $CarMesh/tmpParent/Car/body


export (bool) var show_debug = false
var sphere_offset = Vector3(0, -1.5, .5)
export var acceleration = 65
export var steering = 60
export var turn_speed = 6
export var turn_stop_limit = 0.75
export var body_tilt = 40
var entered = 0
var start = false
var stop = false
# export var start_delay = 5.0

var speed_input = 0
var rotate_input = 0

# ai
export var num_rays = 32
export var look_ahead = 16.0
export var brake_distance = 5.0
export var acceleration_bottom = 0.8
export var acceleration_top = 1

var interest = []
var danger = []
var chosen_dir = Vector3.ZERO
var forward_ray

func _ready():
	$Ball/DebugMesh.visible = show_debug
	ground_ray.add_exception(ball)
	randomize()
	acceleration *= rand_range(acceleration_bottom, acceleration_top)
	interest.resize(num_rays)
	danger.resize(num_rays)
	add_rays()
	
func add_rays():
	var angle = 2 * PI / num_rays
	for i in num_rays:
		var r = RayCast.new()
		$CarMesh/ContextRays.add_child(r)
		r.cast_to = Vector3.FORWARD * look_ahead
		r.rotation.y = -angle * i
		r.enabled = true
	forward_ray = $CarMesh/ContextRays.get_child(0)

func get_path_direction(position):
	var offset = $Path.curve.get_closest_offset(position)
	$Path/PathFollow.offset = offset
	return $Path/PathFollow.transform.basis.z

func set_interest():
	var path_direction = -car_mesh.transform.basis.z
	if owner and owner.has_method("get_path_direction"):
		path_direction = owner.get_path_direction(ball.global_transform.origin)
	for i in num_rays:
		var d = -$CarMesh/ContextRays.get_child(i).global_transform.basis.z
		d = d.dot(path_direction)
		interest[i] = max(0, d)

func set_danger():
	for i in num_rays:
		var ray = $CarMesh/ContextRays.get_child(i)
		danger[i] = 1.0 if ray.is_colliding() else 0.0
		
func choose_direction():
	for i in num_rays:
		if danger[i] > 0.0:
			interest[i] = 0.0
	chosen_dir = Vector3.ZERO
	for i in num_rays:
		chosen_dir += -$CarMesh/ContextRays.get_child(i).global_transform.basis.z * interest[i]
	chosen_dir = chosen_dir.normalized()

func angle_dir(fwd, target, up):
	# Returns how far "target" vector is to the left (negative)
	# or right (positive) of "fwd" vector.
	var p = fwd.cross(target)
	var dir = p.dot(up)
	return dir
	
func set_stop():
	stop = true
	
func _process(delta):
	if stop:
		acceleration = 0
	#yield(get_tree().create_timer(start_delay), "timeout")
	if start:
	# Can't steer/accelerate when in the air
		#if not ground_ray.is_colliding():
			#return
		set_interest()
		set_danger()
		choose_direction()
		# f/b input
		speed_input = acceleration
		# steer input
	#	rotate_target = lerp(rotate_target, rotate_input, 5 * delta)
		var a = angle_dir(-car_mesh.transform.basis.z, chosen_dir, car_mesh.transform.basis.y)
		rotate_input = a * deg2rad(steering)
		# rotate wheels for effect
		right_wheel.rotation.y = rotate_input*2
		left_wheel.rotation.y = rotate_input*2
		# brakes
		if forward_ray.is_colliding():
			var d = ball.global_transform.origin.distance_to(forward_ray.get_collision_point())
			if d < brake_distance:
				speed_input -=  10 * acceleration * (1 - d/brake_distance)

		# rotate car mesh
		if ball.linear_velocity.length() > turn_stop_limit:
			var new_basis = car_mesh.global_transform.basis.rotated(car_mesh.global_transform.basis.y, rotate_input)
			car_mesh.global_transform.basis = car_mesh.global_transform.basis.slerp(new_basis, turn_speed * delta)
			car_mesh.global_transform = car_mesh.global_transform.orthonormalized()
			# tilt body for effect
			var t = -rotate_input * ball.linear_velocity.length() / body_tilt
			body_mesh.rotation.z = lerp(body_mesh.rotation.z, t, 10 * delta)
		# align mesh with ground normal
		var n = ground_ray.get_collision_normal()
		var xform = align_with_y(car_mesh.global_transform, n.normalized())
		car_mesh.global_transform = car_mesh.global_transform.interpolate_with(xform, 10 * delta)
		
			# smoke?
		var d = ball.linear_velocity.normalized().dot(-car_mesh.transform.basis.z)
		if ball.linear_velocity.length() > 5.5 and d < 0.98:
			$CarMesh/Smoke.emitting = true
			$CarMesh/Smoke2.emitting = true
		else:
			$CarMesh/Smoke.emitting = false
			$CarMesh/Smoke2.emitting = false
	
func _physics_process(delta):
#	car_mesh.transform.origin = ball.transform.origin + sphere_offset
	# just lerp the y due to trimesh bouncing
	car_mesh.transform.origin.x = ball.transform.origin.x + sphere_offset.x
	car_mesh.transform.origin.z = ball.transform.origin.z + sphere_offset.z
	car_mesh.transform.origin.y = lerp(car_mesh.transform.origin.y, ball.transform.origin.y + sphere_offset.y, 1 * delta)
#	car_mesh.transform.origin = lerp(car_mesh.transform.origin, ball.transform.origin + sphere_offset, 0.3)
	ball.add_central_force(-car_mesh.global_transform.basis.z * speed_input)

func align_with_y(xform, new_y):
	xform.basis.y = new_y
	xform.basis.x = -xform.basis.z.cross(new_y)
	xform.basis = xform.basis.orthonormalized()
	return xform
		
func _on_Timer_timeout():
	if entered == 5:
		start = true
	entered += 1
