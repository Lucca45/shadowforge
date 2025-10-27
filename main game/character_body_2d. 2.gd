extends CharacterBody2D

@export var speed: float = 50.0
@export var left_limit: float = -100.0
@export var right_limit: float = 100.0

@onready var gameover = get_node("/root/MainScene/GameOverMenu")
@onready var restart = get_node("/root/MainScene/Restartingknop")

var direction: int = 1
var start_position: Vector2

func _ready():
	start_position = global_position  
	gameover.visible = false     
	restart.visible = true
	$Area2D.body_entered.connect(_on_body_entered)
	get_tree().paused = false
	
func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		print("Zombie touched player!")
		body.queue_free()
		gameover.visible = true
		get_tree().paused = true

func _physics_process(delta):
	global_position.x += direction * speed * delta
	
	if global_position.x > start_position.x + right_limit:
		direction = -1
		$Sprite2D.flip_h = true
	elif global_position.x < start_position.x + left_limit:
		direction = 1
		$Sprite2D.flip_h = false


func _on_restart_button_pressed() -> void:
	get_tree().change_scene_to_file("res://node_2d2.tscn")


func _on_restartingknop_restart() -> void:
	get_tree().change_scene_to_file("res://node_2d2.tscn")
