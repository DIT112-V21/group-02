extends Reference

var mod_name: String = "raceagainst"

func init(global) -> void:
	global.register_environment("Race Against Machine", preload("res://src/environments/raceagainst/RaceAgainst.tscn"))
