extends Node

var headlights = preload("res://src/environments/monstermap/Headlights.tscn")
var music = preload("res://src/environments/monstermap/player_music.tscn")
var nitro = preload("res://src/environments/monstermap/CarBoost.tscn")
onready var monster = get_parent().get_node("monster")
# Declare member variables here. Examples:
# var a = 2
# var b = "text"


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass


func _on_Area_body_entered(body: RigidBody):
	if body != null  && body != monster:
		var smce = instance_from_id(body.get_instance_id())
		smce.add_child(headlights.instance())
		smce.add_child(music.instance())
		smce.add_child(nitro.instance())
