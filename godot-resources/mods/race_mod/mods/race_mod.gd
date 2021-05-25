extends Reference

var mod_name: String = "race"

func init(global) -> void:
	
	global.register_environment("race/Race", preload("res://src/environments/race/Race.tscn"))
