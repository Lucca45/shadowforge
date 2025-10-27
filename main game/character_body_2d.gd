extends CharacterBody2D


const SPEED = 300.0
const JUMP_VELOCITY = -400.0
@onready var anim_sprite = $AnimatedSprite2D
@onready var static_sprite = $Sprite2D
@onready var restart = get_node("/root/MainScene/Restartingknop")
var gems_collected = 0
var total_gems = 2

func _ready():
	restart.visible = true
	
func _physics_process(delta: float) -> void:

	if not is_on_floor():
		velocity += get_gravity() * delta

	if Input.is_action_just_pressed("ui_accept") and is_on_floor():
		velocity.y = JUMP_VELOCITY


	var direction := Input.get_axis("ui_left", "ui_right")
	if direction:
		velocity.x = direction * SPEED
		anim_sprite.visible = true
		static_sprite.visible = false
		anim_sprite.flip_h = direction < 0
		
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		anim_sprite.visible = false
		static_sprite.visible = true
		
	move_and_slide()
	
func collect_gem():
	gems_collected += 1
	print("Gems collected: ", gems_collected)
	
func _on_body_entered(body: Node) -> void:
	print("player touched by:", body)  
	


func _on_restartingknop_restart() -> void:
	get_tree().change_scene_to_file("res://huh.tscn")
