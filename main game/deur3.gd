extends Area2D

@onready var open_sprite = $Sprite2D2
@onready var locked_sprite = $Dicht

func _ready():
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		if body.gems_collected >= body.total_gems:
			locked_sprite.visible = false
			open_sprite.visible = true
			print("Door unlocked!")
			# Use deferred call to safely change the scene
			call_deferred("change_scene")
		else:
			locked_sprite.visible = true
			open_sprite.visible = false
			print("Door locked. Collect more gems!")

func change_scene():
	get_tree().change_scene_to_file("res://huh.tscn")
