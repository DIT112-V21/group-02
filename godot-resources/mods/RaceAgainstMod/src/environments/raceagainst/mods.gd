extends Node

var smceMinimap = preload("res://src/environments/raceagainst/replacements/minimapSMCE.tscn")
var newBody = preload("res://src/environments/raceagainst/replacements/body.tscn")
var LB = preload("res://src/environments/raceagainst/replacements/wheel_backLeft.tscn")
var RB = preload("res://src/environments/raceagainst/replacements/wheel_backRight.tscn")
var LF = preload("res://src/environments/raceagainst/replacements/wheel_frontLeft.tscn")
var RF = preload("res://src/environments/raceagainst/replacements/wheel_frontRight.tscn")


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass


func _on_StartPlate_body_entered(body: RigidBody):
	var smceID = body.get_instance_id()
	var smce = instance_from_id(smceID)
	smce.get_node("Hull").queue_free()
	smce.add_child(newBody.instance())
	smce.get_node("Sprite3D").queue_free()
	
	smce.get_node("LeftBack").get_node("wheel").get_node("wheel").queue_free()
	#smce.get_node("LeftBack").get_node("wheel").add_child(LB.instance())
	
	smce.get_node("RightBack").get_node("wheel").get_node("wheel").queue_free()
	#smce.get_node("RightBack").get_node("wheel").add_child(RB.instance())
	
	smce.get_node("LeftFront").get_node("wheel").get_node("wheel").queue_free()
	#smce.get_node("LeftFront").get_node("wheel").add_child(LF.instance())
	
	smce.get_node("RightFront").get_node("wheel").get_node("wheel").queue_free()
	#smce.get_node("RightFront").get_node("wheel").add_child(RF.instance())
	body.get_tree().get_root().get_node("/root/Master/World/Camera/InterpolatedCamera").set_cull_mask(524287)
	smce.add_child(smceMinimap.instance())
