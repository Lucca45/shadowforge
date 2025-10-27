extends Area2D

func _ready():
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node) -> void:
	print("Gem touched by:", body) 
	if body.is_in_group("player"):
		print("Player collected the gem!") 
		body.collect_gem()
		queue_free()
