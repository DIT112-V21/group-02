extends Reference

var mod_name: String = "monstermap"

func init(global) -> void:
	global.register_environment("The Monster Map", preload("res://src/environments/monstermap/MonsterMap.tscn"))
